import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { ThrottlerModule } from '@nestjs/throttler';
import { PromotionManagementModule } from './api/promotion-management/promotion-management.module';

@Module({
  imports: [
    // 환경 변수 설정
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    // MongoDB 연결
    MongooseModule.forRoot(process.env.MONGODB_URI || 'mongodb://localhost:27017/promotion-manager'),

    // 요청 제한 설정
    ThrottlerModule.forRoot([
      {
        ttl: 60000, // 1분
        limit: 100, // 최대 100개 요청
      },
    ]),

    // 기능 모듈
    PromotionManagementModule,
  ],
})
export class AppModule {} 