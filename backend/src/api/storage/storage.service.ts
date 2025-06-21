import { Injectable } from '@nestjs/common';
import { S3Client, PutObjectCommand, DeleteObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { ConfigService } from '@nestjs/config';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class StorageService {
  private s3Client: S3Client;
  private bucketName: string;

  constructor(private configService: ConfigService) {
    // AWS S3/R2 설정이 있으면 클라우드 스토리지 사용, 없으면 로컬 저장소 사용
    const accessKeyId = this.configService.get('AWS_ACCESS_KEY_ID');
    const secretAccessKey = this.configService.get('AWS_SECRET_ACCESS_KEY');
    const region = this.configService.get('AWS_REGION');
    const endpoint = this.configService.get('AWS_ENDPOINT');
    
    this.bucketName = this.configService.get('AWS_BUCKET_NAME') || 'promotion-files';

    if (accessKeyId && secretAccessKey) {
      this.s3Client = new S3Client({
        region,
        credentials: {
          accessKeyId,
          secretAccessKey,
        },
        endpoint,
      });
    }
  }

  async uploadFile(file: Express.Multer.File, key: string): Promise<string> {
    if (this.s3Client) {
      // 클라우드 스토리지에 업로드
      const command = new PutObjectCommand({
        Bucket: this.bucketName,
        Key: key,
        Body: file.buffer,
        ContentType: file.mimetype,
      });

      await this.s3Client.send(command);
      return this.getFileUrl(key);
    } else {
      // 로컬 저장소에 저장
      const uploadDir = path.join(process.cwd(), 'uploads');
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }

      const filePath = path.join(uploadDir, key);
      const dir = path.dirname(filePath);
      
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }

      fs.writeFileSync(filePath, file.buffer);
      return `/uploads/${key}`;
    }
  }

  async deleteFile(key: string): Promise<void> {
    if (this.s3Client) {
      // 클라우드 스토리지에서 삭제
      const command = new DeleteObjectCommand({
        Bucket: this.bucketName,
        Key: key,
      });

      await this.s3Client.send(command);
    } else {
      // 로컬 파일 삭제
      const filePath = path.join(process.cwd(), 'uploads', key);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }
  }

  async getFile(key: string): Promise<Buffer> {
    if (this.s3Client) {
      // 클라우드 스토리지에서 파일 가져오기
      const command = new GetObjectCommand({
        Bucket: this.bucketName,
        Key: key,
      });

      const response = await this.s3Client.send(command);
      const chunks: Buffer[] = [];
      
      // ReadableStream을 Buffer로 변환
      const stream = response.Body as NodeJS.ReadableStream;
      for await (const chunk of stream) {
        chunks.push(chunk);
      }
      
      return Buffer.concat(chunks);
    } else {
      // 로컬 파일 읽기
      const filePath = path.join(process.cwd(), 'uploads', key);
      if (fs.existsSync(filePath)) {
        return fs.readFileSync(filePath);
      }
      throw new Error('파일을 찾을 수 없습니다.');
    }
  }

  private getFileUrl(key: string): string {
    if (this.s3Client) {
      const endpoint = this.configService.get('AWS_ENDPOINT');
      if (endpoint) {
        return `${endpoint}/${this.bucketName}/${key}`;
      }
      return `https://${this.bucketName}.s3.amazonaws.com/${key}`;
    } else {
      return `/uploads/${key}`;
    }
  }

  generateFileKey(directory: string, fileName: string): string {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    return `${directory}/${timestamp}_${fileName}`;
  }
} 