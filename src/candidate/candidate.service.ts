import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCandidateDto } from './dto/create-candidate.dto';
import { UpdateCandidateDto } from './dto/update-candidate.dto';
import { SendEmailDto } from './dto/send-email.dto';
import { PrismaService } from '../prisma/prisma.service';
import * as nodemailer from 'nodemailer';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class CandidateService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly config: ConfigService
  ) { }

  // Create a new candidate
  async create(createCandidateDto: CreateCandidateDto, userId: number) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');

    const candidate = await this.prisma.candidate.create({
      data: {
        firstName: createCandidateDto.firstName,
        lastName: createCandidateDto.lastName,
        email: createCandidateDto.email,
        mobile_number: createCandidateDto.mobile_number,
        user: { connect: { id: userId } },
      },
    });

    await this.sendCreationEmail(candidate);

    return {
      success: true,
      message: 'Candidate created successfully. Email sent for profile update.',
      data: candidate,
    };
  }

  private async sendCreationEmail(candidate: SendEmailDto) {
    const transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: this.config.get('HOST_EMAIL'),
        pass: this.config.get('HOST_PASSWORD'),
      },
    });

    const updateLink = `${this.config.get('APP_URL')}/update_candidate/${candidate.userId}/candidate/${candidate.id}`;

    const mailOptions = {
      from: 'dscemailcheck7756@gmail.com',
      to: candidate.email,
      subject: 'Please update your profile',
      html: `
        <p>Hello ${candidate.firstName} ${candidate.lastName},</p>
        <p>Please update your profile by clicking the link below:</p>
        <a href="${updateLink}">Update Your Profile</a>
        <p>If you did not request this, please ignore this email.</p>
      `,
    };

    try {
      await transporter.sendMail(mailOptions);
      console.log('✅ Email sent to:', candidate.email);
    } catch (error) {
      console.error('❌ Error sending email:', error);
    }
  }

  // Update candidate details
  async update(userId: number, candidateId: number, updateCandidateDto: UpdateCandidateDto) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');

    const candidate = await this.prisma.candidate.findUnique({ where: { id: candidateId } });
    if (!candidate || candidate.userId !== userId) throw new NotFoundException('Candidate not found');

    const updatedCandidate = await this.prisma.candidate.update({
      where: { id: candidateId },
      data: {
        email: updateCandidateDto.email,
        mobile_number: updateCandidateDto.mobile_number,
        firstName: updateCandidateDto.firstName,
        lastName: updateCandidateDto.lastName,
        dateOfBirth: updateCandidateDto.dateOfBirth,

        educations: {
          create: updateCandidateDto.educations.map((education) => ({
            institution: education.institution,
            qualification: education.qualification,
            contactPerson: education.contactPerson,
            contactEmail: education.contactEmail,
            contactPhone: education.contactPhone,
          })),
        },

        previousEmployers: {
          create: updateCandidateDto.previousEmployers.map((employer) => ({
            companyName: employer.companyName,
            position: employer.position,
            contactPerson: employer.contactPerson,
            contactEmail: employer.contactEmail,
            contactPhone: employer.contactPhone,
          })),
        },
      },
      include: { educations: true, previousEmployers: true },
    });

    return {
      success: true,
      message: 'Candidate updated successfully.',
      data: updatedCandidate,
    };
  }

  // Get all candidates under a user
  async findAllByUserId(userId: number) {
    const candidates = await this.prisma.candidate.findMany({ where: { userId } });
    if (!candidates.length) throw new NotFoundException('No candidates found for this user');

    return {
      success: true,
      message: 'Candidates retrieved successfully.',
      data: candidates,
    };
  }

  // Get a candidate by ID under a user
  async findOne(userId: number, candidateId: number) {
    const candidate = await this.prisma.candidate.findFirst({
      where: { id: candidateId, userId },
      include: { previousEmployers: true, educations : true }, // If there are relations
    });

    if (!candidate) throw new NotFoundException('Candidate not found');

    return {
      success: true,
      message: 'Candidate retrieved successfully.',
      data: candidate,
    };
  }

  // Delete a candidate under a user
  async remove(userId: number, candidateId: number) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');

    const candidate = await this.prisma.candidate.findUnique({ where: { id: candidateId } });
    if (!candidate || candidate.userId !== userId) throw new NotFoundException('Candidate not found');

    await this.prisma.candidate.delete({ where: { id: candidateId } });

    return {
      success: true,
      message: 'Candidate deleted successfully.',
    };
  }
}
