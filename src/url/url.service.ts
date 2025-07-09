import { Injectable, ConflictException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Url } from './url.schema';
import { CreateUrlDto } from './url.dto';
import * as shortid from 'shortid';

@Injectable()
export class UrlService {
  constructor(@InjectModel(Url.name) private urlModel: Model<Url>) {}

  async createShortUrl(dto: CreateUrlDto) {
    const shortCode = dto.customCode || shortid.generate();
    const existing = await this.urlModel.findOne({ shortCode });
    if (existing) throw new ConflictException('Custom code already exists');

    const newUrl = new this.urlModel({
      originalUrl: dto.url,
      shortCode,
    });
    await newUrl.save();

    return {
      originalUrl: dto.url,
      shortUrl: `${process.env.BASE_URL}/r/${shortCode}`,
    };
  }

  async getUrlAndIncrement(shortCode: string) {
    const url = await this.urlModel.findOne({ shortCode });
    if (url) {
      url.clicks++;
      await url.save();
    }
    return url;
  }

  async getStats(shortCode: string) {
    return await this.urlModel.findOne({ shortCode });
  }
}
