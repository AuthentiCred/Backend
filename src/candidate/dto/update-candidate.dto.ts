import { IsEmail, IsNotEmpty, IsString, IsDate, ValidateNested, IsArray } from 'class-validator';
import { Type } from 'class-transformer';

class EducationDto {
  @IsString()
  @IsNotEmpty()
  institution: string;

  @IsString()
  @IsNotEmpty()
  qualification: string;

  @IsString()
  @IsNotEmpty()
  contactPerson: string;

  @IsEmail()
  @IsNotEmpty()
  contactEmail: string;

  @IsString()
  @IsNotEmpty()
  contactPhone: string;
}

class PreviousEmployerDto {
  @IsString()
  @IsNotEmpty()
  companyName: string;

  @IsString()
  @IsNotEmpty()
  position: string;

  @IsString()
  @IsNotEmpty()
  contactPerson: string;

  @IsEmail()
  @IsNotEmpty()
  contactEmail: string;

  @IsString()
  @IsNotEmpty()
  contactPhone: string;
}

export class UpdateCandidateDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  mobile_number: string;

  @IsString()
  @IsNotEmpty()
  firstName: string;

  @IsString()
  @IsNotEmpty()
  lastName: string;

  @IsDate()
  @IsNotEmpty()
  @Type(() => Date) // Make sure the date is parsed correctly
  dateOfBirth: Date;

  isVerified: boolean;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => EducationDto)
  educations: EducationDto[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PreviousEmployerDto)
  previousEmployers: PreviousEmployerDto[];
}
