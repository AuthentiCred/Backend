import { Injectable, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AuthDto, loginDto, userDto } from './dto';
import * as argon from 'argon2';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private config: ConfigService,
  ) { }

  // Signup method
  async signup(dto: AuthDto) {
    const hash = await argon.hash(dto.password);
    try {
      const user = await this.prisma.user.create({
        data: {
          email: dto.email,
          hash,
          name: dto.name,
        },
      });
      return this.signToken(user.id, user.email);
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ForbiddenException('Credentials taken');
        }
      }
      throw error;
    }
  }

  // Signin method
  async signin(dto: loginDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (!user) throw new ForbiddenException('Credentials incorrect');

    const pwMatches = await argon.verify(user.hash, dto.password);
    if (!pwMatches) throw new ForbiddenException('Credentials incorrect');

    return this.signToken(user.id, user.email);
  }

  // Generate JWT Token with longer expiration (2 days)
  async signToken(userId: number, email: string): Promise<{ access_token: string; success: boolean; user: userDto }> {
    const payload = { sub: userId, email };
    const secret = this.config.get('JWT_SECRET');

    const token = await this.jwt.signAsync(payload, {
      expiresIn: '2d', // Token valid for 2 days
      secret,
    });

    const user = await this.prisma.user.findUnique({
      where: { email: email },
      select: {
        name: true,
        email: true,
        id: true,
      }
    });

    return { access_token: token, success: true, user };
  }

  // Validate user using the stored token // Validate user using the stored token
  async validateUser(token: string) {
    try {
      const decoded = await this.jwt.verifyAsync(token);
      const user = await this.prisma.user.findUnique({
        where: { id: decoded.sub },
        select: { id: true, email: true, name: true },
      });
      return user || null;
    } catch (error) {
      return error || null;
    }
  }
}
