import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCandidateDto } from './dto/create-candidate.dto'; // DTO for creating a candidate
import { UpdateCandidateDto } from './dto/update-candidate.dto'; // DTO for updating a candidate
import { PrismaService } from '../prisma/prisma.service'

@Injectable()
export class CandidateService {
  constructor(private readonly prisma: PrismaService) {}

  // Create a new candidate and associate it with a user
  async create(createCandidateDto: CreateCandidateDto, userId: number) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    return this.prisma.candidate.create({
      data: {
        name: createCandidateDto.name,
        email: createCandidateDto.email,
        number: createCandidateDto.number,
        user: {
          connect: { id: userId }, // Link the candidate to the user
        },
      },
    });
  }

  // Get all candidates associated with a specific user
  async findAllByUserId(userId: number) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    return this.prisma.candidate.findMany({
      where: { userId: userId },
    });
  }

  // Find a specific candidate by ID for a specific user
  async findOne(userId: number, candidateId: number) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const candidate = await this.prisma.candidate.findUnique({
      where: { id: candidateId },
    });
    if (!candidate || candidate.userId !== userId) {
      throw new NotFoundException('Candidate not found');
    }

    return candidate;
  }

  // Update a candidate under a specific user
  async update(userId: number, candidateId: number, updateCandidateDto: UpdateCandidateDto) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const candidate = await this.prisma.candidate.findUnique({
      where: { id: candidateId },
    });
    if (!candidate || candidate.userId !== userId) {
      throw new NotFoundException('Candidate not found');
    }

    return this.prisma.candidate.update({
      where: { id: candidateId },
      data: { ...updateCandidateDto },
    });
  }

  // Delete a candidate under a specific user
  async remove(userId: number, candidateId: number) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const candidate = await this.prisma.candidate.findUnique({
      where: { id: candidateId },
    });
    if (!candidate || candidate.userId !== userId) {
      throw new NotFoundException('Candidate not found');
    }

    return this.prisma.candidate.delete({
      where: { id: candidateId },
    });
  }
}
