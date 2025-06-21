import { IsString, IsOptional } from 'class-validator';
import { ObjectId } from 'mongodb';

export type CategoryType = 'file' | 'directory';

export class CreatePromotionNodeDto {
  @IsString()
  name?: string; // file 에서는 받지 않아도 됨.

  @IsOptional()
  @IsString()
  parentId?: string;
}

export interface PromotionNodeDto {
  _id: string | ObjectId;
  name: string;
  category: CategoryType;
  size?: number | null;
  path?: string | null;
  fileUrl?: string | null; // file 에만 있음
  parentId?: string | ObjectId | null;
  createdAt?: Date | null;
  updatedAt?: Date | null;
  children?: PromotionNodeDto[]; // 트리 구조로 변환 시 필요
}

export interface AuthUser {
  name: string;
  email: string;
}

export interface Result {
  result: boolean;
  msg?: string;
}

// 클라이언트 결과 반환용 DTO
export interface GetPromotionNodesDto extends Result {
  nodes: PromotionNodeDto[];
}

export interface GetPromotionNodeDto extends Result {
  node: PromotionNodeDto;
}

export interface GetAuthUsersDto extends Result {
  authUsers: AuthUser[];
} 