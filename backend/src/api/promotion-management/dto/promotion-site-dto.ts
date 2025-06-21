import { IsString, IsOptional } from 'class-validator';
import { ObjectId } from 'mongodb';

export class CreatePromotionSiteDto {
  @IsString()
  name: string; // 사이트 이름

  @IsString()
  description: string; // 사이트 설명

  @IsString()
  url: string; // 사이트 URL
}

export class UpdatePromotionSiteDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  url?: string;
}

export interface PromotionSiteDto {
  _id: string | ObjectId;
  name: string;
  description: string;
  url: string;
}

export interface Result {
  result: boolean;
  msg?: string;
}

// 클라이언트 결과 반환용 DTO
export interface GetPromotionSitesDto extends Result {
  sites: PromotionSiteDto[];
}

export interface GetPromotionSiteDto extends Result {
  site: PromotionSiteDto;
} 