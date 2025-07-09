import { Controller, Post, Body, Get, Param, Res, NotFoundException, ConflictException, HttpCode } from '@nestjs/common';
import { UrlService } from './url.service';
import { CreateUrlDto } from './url.dto';
import { Response } from 'express';

@Controller()
export class UrlController {
  constructor(private readonly urlService: UrlService) {}

  @Post('api/shorten')
  async shortenUrl(@Body() createUrlDto: CreateUrlDto) {
    return this.urlService.createShortUrl(createUrlDto);
  }

  @Get('r/:shortCode')
  async redirect(@Param('shortCode') shortCode: string, @Res() res: Response) {
    const url = await this.urlService.getUrlAndIncrement(shortCode);
    if (!url) throw new NotFoundException('Short URL not found');
    return res.redirect(url.originalUrl);
  }

  @Get('api/stats/:shortCode')
  async getStats(@Param('shortCode') shortCode: string) {
    const stats = await this.urlService.getStats(shortCode);
    if (!stats) throw new NotFoundException('Short URL not found');
    return stats;
  }
}
