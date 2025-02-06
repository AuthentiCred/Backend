import { IsOptional, IsString, IsEmail, IsNotEmpty, IsNumber} from 'class-validator';

export class SendEmailDto {
    @IsNotEmpty()
    @IsNumber()
    id?: number

    @IsOptional()
    @IsString()
    firstName?: string;

    @IsOptional()
    @IsString()
    lastName?: string;

    @IsNotEmpty()
    @IsEmail()
    email?: string;

    @IsOptional()
    number?: string;

    @IsNotEmpty()
    userId?: number;
}
