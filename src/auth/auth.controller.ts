import { Body, Controller, Get, HttpCode, HttpStatus, Post, Req , UseGuards} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto, loginDto } from './dto';
import { JwtGuard } from './guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signup')
  signup(@Body() dto: AuthDto) {
    return this.authService.signup(dto);
  }

  @HttpCode(HttpStatus.OK)
  @Post('signin')
  signin(@Body() dto: loginDto) {
    return this.authService.signin(dto);
  }

  // Validate token on page refresh
  @Get('user')
  @UseGuards(JwtGuard)  // Apply the guard here
  async getMe(@Req() req) {
    const token = req.headers.authorization?.split(' ')[1]; // Extract token from headers
    if (!token) return { success: false, message: 'No token provided' };

    const user = await this.authService.validateUser(token);
    return user ? { success: true, user } : { success: false };
  }
}
