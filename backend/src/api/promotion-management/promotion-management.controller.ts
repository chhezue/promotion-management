import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseInterceptors,
  UploadedFiles,
  Query,
  HttpException,
  HttpStatus,
  NestInterceptor,
  Res,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { PromotionManagementService } from './promotion-management.service';
import {
  CreatePromotionSiteDto,
  UpdatePromotionSiteDto,
} from './dto/promotion-site-dto';
import { FilesInterceptor } from '@nestjs/platform-express';
import { CreatePromotionNodeDto } from './dto/promotion-node-dto';
import { diskStorage } from 'multer';
import { dirname, join } from 'path';
import { Response } from 'express';
import * as dayjs from 'dayjs';

@ApiTags('홍보 자료 통합 관리 API')
@Controller('promotion-management')
export class PromotionManagementController {
  constructor(
    private readonly promotionManagementService: PromotionManagementService,
  ) {}

  // -------------------- [ 어드민 관련 API ] --------------------

  @ApiOperation({ summary: '어드민 권한자들 불러오기' })
  @Get('/auth')
  async getAuthUsers() {
    return this.promotionManagementService.getAuthUsers();
  }

  // -------------------- [ 사이트 관련 API ] --------------------

  @ApiOperation({ summary: '모든 바로가기 사이트 목록 조회' })
  @Get('/site')
  async getSites() {
    return this.promotionManagementService.getSites();
  }

  @ApiOperation({ summary: '새로운 바로가기 사이트 생성' })
  @Post('/site')
  async createSite(@Body() dto: CreatePromotionSiteDto) {
    return this.promotionManagementService.createSite(dto);
  }

  @ApiOperation({ summary: '기존 사이트 정보 수정' })
  @Patch('/site/:siteId')
  async updateSite(
    @Param('siteId') siteId: string,
    @Body() dto: UpdatePromotionSiteDto,
  ) {
    return this.promotionManagementService.updateSite(siteId, dto);
  }

  @ApiOperation({ summary: '사이트 삭제' })
  @Delete('/site/:siteId')
  async deleteSite(@Param('siteId') siteId: string) {
    return this.promotionManagementService.deleteSite(siteId);
  }

  // -------------------- [ 노드(폴더/파일) 관련 API ] --------------------

  @ApiOperation({ summary: '전체 폴더 및 파일 목록 조회' })
  @Get('/node')
  async getNodes() {
    return this.promotionManagementService.getNodes();
  }

  @ApiOperation({ summary: '최근 업로드된 문서 4개 조회' })
  @Get('/node/recent-file')
  async getRecentDocuments() {
    return this.promotionManagementService.getRecentDocuments();
  }

  @ApiOperation({ summary: '노드 검색 (이름 기반)' })
  @Get('/node/search')
  async search(@Query('keyword') keyword: string) {
    return this.promotionManagementService.search(keyword);
  }

  @ApiOperation({ summary: '노드 복제 (하위 항목 포함 복사)' })
  @Post('/node/copy/:targetNodeId')
  async copyNode(@Param('targetNodeId') targetNodeId: string) {
    return this.promotionManagementService.copyNode(targetNodeId);
  }

  @ApiOperation({ summary: '단일 노드 상세 조회' })
  @Get('/node/:nodeId')
  async getNodeById(@Param('nodeId') nodeId: string) {
    return this.promotionManagementService.getNodeById(nodeId);
  }

  @ApiOperation({ summary: '직속 자식 노드만 조회 (1 depth)' })
  @Get('/node/:nodeId/immediate-children')
  async getImmediateNode(@Param('nodeId') nodeId: string) {
    return this.promotionManagementService.getImmediateNode(nodeId);
  }

  @ApiOperation({ summary: '새 폴더 생성' })
  @Post('/node/directory')
  async createDirectory(@Body() dto: CreatePromotionNodeDto) {
    return this.promotionManagementService.createDirectory(dto);
  }

  @ApiOperation({ summary: '파일 업로드 (최대 5개)' })
  @Post('/node/file')
  @UseInterceptors(
    FilesInterceptor('files', 5, {
      storage: diskStorage({
        destination: join(dirname('../'), 'uploads'),
        filename: (req, file, callback) => {
          const safeName = Buffer.from(file.originalname, 'latin1').toString(
            'utf8',
          );
          try {
            callback(
              null,
              `${dayjs(new Date()).format('YYYYMMDDHHmmssSSS')}_${safeName}`,
            );
          } catch (error) {
            console.error('파일명 디코딩 중 오류:', error);
            callback(null, safeName);
          }
        },
      }),
      fileFilter: (req, file, callback) => {
        const allowedMimeTypes = [
          'image/jpeg',
          'image/jpg',
          'image/png',
          'application/pdf',
          'application/vnd.ms-powerpoint',
          'application/vnd.openxmlformats-officedocument.presentationml.presentation',
          'application/msword',
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
          'application/vnd.ms-excel',
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        ];

        if (!allowedMimeTypes.includes(file.mimetype)) {
          return callback(
            new HttpException(
              '허용되지 않은 파일 형식입니다. (jpg, png, pdf, Word, Excel, PPT만 가능)',
              HttpStatus.BAD_REQUEST,
            ),
            false,
          );
        }
        callback(null, true);
      },
    }) as unknown as NestInterceptor,
  )
  async createFiles(
    @Body() dto: CreatePromotionNodeDto,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    return this.promotionManagementService.createFiles(files, dto);
  }

  @ApiOperation({ summary: '노드 이름 변경' })
  @Patch('/node/:nodeId')
  async updateNodeName(
    @Param('nodeId') nodeId: string,
    @Body() body: { name: string },
  ) {
    return this.promotionManagementService.updateNodeName(nodeId, body.name);
  }

  @ApiOperation({ summary: '노드 삭제' })
  @Delete('/node/:nodeId')
  async deleteNode(@Param('nodeId') nodeId: string) {
    return this.promotionManagementService.deleteNode(nodeId);
  }

  @ApiOperation({ summary: '폴더 압축 다운로드' })
  @Get('node/:nodeId/download')
  async downloadFolder(@Param('nodeId') nodeId: string, @Res() res: Response) {
    return this.promotionManagementService.downloadDirectoryAsZip(nodeId, res);
  }

  @ApiOperation({ summary: '같은 부모를 가진 파일노드들의 순서 업데이트' })
  @Patch('node/position/:parentId')
  async updateNodePosition(
    @Param('parentId') parentId: string,
    @Body()
    body: {
      content: Array<{ _id: string; order: number }>;
    },
  ) {
    return this.promotionManagementService.updateNodePosition(parentId, body);
  }
} 