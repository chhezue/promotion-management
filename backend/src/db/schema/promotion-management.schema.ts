import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';

export type CategoryType = 'file' | 'directory';

@Schema({
  versionKey: false,
  collection: 'promotion-nodes',
  timestamps: true,
})
export class PromotionNodes {
  @Prop()
  name: string; // 항목 이름

  @Prop()
  sort: number; // 정렬을 위한 필드

  @Prop()
  size: number; // 파일 크기

  @Prop()
  path: string; // 파일 경로

  @Prop()
  fileUrl: string; // aws에 저장된 파일 url

  @Prop({ default: true })
  use: boolean; // true = 화면에 노출, false = 노출 X

  @Prop({ enum: ['directory', 'file'] })
  category: CategoryType;

  @Prop({ type: Types.ObjectId, ref: 'PromotionNode', default: null })
  parentId: Types.ObjectId; // 부모 참조

  @Prop()
  order?: number; // 파일 정렬 기준
}

@Schema({ versionKey: false, collection: 'promotion-sites', timestamps: true })
export class PromotionSites {
  @Prop()
  name: string; // 사이트 이름

  @Prop()
  description: string; // 사이트 설명

  @Prop()
  url: string;

  @Prop()
  sort: string;

  @Prop({ default: true })
  use: boolean;
}

@Schema({ versionKey: false, collection: 'promotion-auth', timestamps: false })
export class PromotionAuth {
  @Prop()
  name: string;

  @Prop()
  email: string;

  @Prop()
  department: string;
}

export const PromotionNodesSchema =
  SchemaFactory.createForClass(PromotionNodes);
export const PromotionSitesSchema =
  SchemaFactory.createForClass(PromotionSites);
export const PromotionAuthSchema = SchemaFactory.createForClass(PromotionAuth); 