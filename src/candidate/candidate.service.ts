import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCandidateDto } from './dto/create-candidate.dto'; // DTO for creating a candidate
import { UpdateCandidateDto } from './dto/update-candidate.dto'; // DTO for updating a candidate
import { SendEmailDto } from './dto/send-email.dto';
import { PrismaService } from '../prisma/prisma.service'
import * as nodemailer from 'nodemailer';
import { ConfigService } from '@nestjs/config'; // Import ConfigService
// Make sure this is properly imported

@Injectable()
export class CandidateService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly config: ConfigService
  ) { }

  // Create a new candidate with only basic information (first name, last name, email, number)
  async create(createCandidateDto: CreateCandidateDto, userId: number) {
    // Step 1: Find the user by userId
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Step 2: Create the candidate with the provided basic info
    const candidate = await this.prisma.candidate.create({
      data: {
        firstName: createCandidateDto.firstName,
        lastName: createCandidateDto.lastName,
        email: createCandidateDto.email,
        mobile_number: createCandidateDto.mobile_number,
        user: {
          connect: { id: userId }, // Link the candidate to the user
        },
      },
    });

    // Step 3: Send email to the candidate for updating their profile
    await this.sendCreationEmail(candidate);

    return candidate;
  }

  private async sendCreationEmail(candidate: SendEmailDto) {
    const transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: this.config.get('HOST_EMAIL'), // Your email
        pass: this.config.get('HOST_PASSWORD'),
      },
    });

    // URL format for updating the profile
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

  // Update other fields for the candidate (dateOfBirth, educations, previousEmployers, etc.)
  async update(userId: number, candidateId: number, updateCandidateDto: UpdateCandidateDto) {
    // Ensure the user exists
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Ensure the candidate exists and belongs to the user
    const candidate = await this.prisma.candidate.findUnique({
      where: { id: candidateId },
    });

    if (!candidate || candidate.userId !== userId) {
      throw new NotFoundException('Candidate not found');
    }

    // Perform the update
    const updatedCandidate = await this.prisma.candidate.update({
      where: { id: candidateId },
      data: {
        email: updateCandidateDto.email,
        mobile_number: updateCandidateDto.mobile_number,
        firstName: updateCandidateDto.firstName,
        lastName: updateCandidateDto.lastName,
        dateOfBirth: updateCandidateDto.dateOfBirth,

        // Insert new education records
        educations: {
          create: updateCandidateDto.educations.map((education) => ({
            institution: education.institution,
            qualification: education.qualification,
            contactPerson: education.contactPerson,
            contactEmail: education.contactEmail,
            contactPhone: education.contactPhone,
          })),
        },

        // Insert new previous employer records
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
      include: {
        educations: true, // Include newly created education records
        previousEmployers: true, // Include newly created previous employer records
      },
    });

    // Return the updated candidate data with the related educations and employers
    return updatedCandidate;
  }

  // Get all candidates under a specific user
  async findAllByUserId(userId: number) {
    const candidates = await this.prisma.candidate.findMany({
      where: { userId }, // Find candidates related to the user
    });

    if (!candidates || candidates.length === 0) {
      throw new NotFoundException('No candidates found for this user');
    }

    return candidates;
  }

  // Get one candidate by ID under a specific user
  async findOne(userId: number, candidateId: number) {
    const candidate = await this.prisma.candidate.findFirst({
      where: {
        id: candidateId,
        userId, // Ensures candidate is associated with the correct user
      },
    });

    if (!candidate) {
      throw new NotFoundException('Candidate not found');
    }

    return candidate;
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
