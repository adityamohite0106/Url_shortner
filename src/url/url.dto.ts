import { IsOptional, IsString, IsUrl } from 'class-validator';

export class CreateUrlDto {
  @IsUrl()
  url!: string; // Add !

  @IsOptional()
  @IsString()
  customCode?: string;
}

