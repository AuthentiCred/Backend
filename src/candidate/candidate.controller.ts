import { Controller, Post, Body, Get, Param, Patch, Delete } from '@nestjs/common';
import { CandidateService } from './candidate.service';
import { CreateCandidateDto } from './dto/create-candidate.dto';
import { UpdateCandidateDto } from './dto/update-candidate.dto';

@Controller('users') // Base route for users, then appending '/:userId/candidates'
export class CandidateController {
  constructor(private readonly candidateService: CandidateService) {}

  // Create a candidate under a specific user
  @Post(':userId/candidates')
  async create(
    @Param('userId') userId: string,  // User ID passed in URL
    @Body() createCandidateDto: CreateCandidateDto, // Candidate details in request body
  ) {
    return this.candidateService.create(createCandidateDto, +userId);
  }

  // Get all candidates under a specific user
  @Get(':userId/candidates')
  async findAll(@Param('userId') userId: string) {
    return this.candidateService.findAllByUserId(+userId);
  }

  // Get one candidate by ID under a specific user
  @Get(':userId/candidates/:candidateId')
  async findOne(
    @Param('userId') userId: string,
    @Param('candidateId') candidateId: string,
  ) {
    return this.candidateService.findOne(+userId, +candidateId);
  }

  // Update a candidate's information under a specific user
  @Patch(':userId/candidates/:candidateId')
  async update(
    @Param('userId') userId: string,
    @Param('candidateId') candidateId: string,
    @Body() updateCandidateDto: UpdateCandidateDto,
  ) {
    return this.candidateService.update(+userId, +candidateId, updateCandidateDto);
  }

  // Remove a candidate under a specific user
  @Delete(':userId/candidates/:candidateId')
  async remove(@Param('userId') userId: string, @Param('candidateId') candidateId: string) {
    return this.candidateService.remove(+userId, +candidateId);
  }
}
