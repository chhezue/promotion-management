import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  PromotionAuth,
  PromotionNodes,
  PromotionSites,
} from '@src/db/schema/promotion-management.schema';
import {
  CreatePromotionSiteDto,
  UpdatePromotionSiteDto,
} from './dto/promotion-site-dto';
import { CreatePromotionNodeDto, PromotionNodeDto } from './dto/promotion-node-dto';

@Injectable()
export class PromotionManagementRepository {
  constructor(
    @InjectModel(PromotionNodes.name)
    private readonly promotionNodesModel: Model<PromotionNodes>,
    @InjectModel(PromotionSites.name)
    private readonly promotionSitesModel: Model<PromotionSites>,
    @InjectModel(PromotionAuth.name)
    private readonly promotionAuthModel: Model<PromotionAuth>,
  ) {}

  async getSites() {
    return this.promotionSitesModel
      .find({ use: true })
      .sort({ createdAt: -1 })
      .lean();
  }

  async createSite(createPromotionSiteDto: CreatePromotionSiteDto) {
    return this.promotionSitesModel.create(createPromotionSiteDto);
  }

  async updateSite(id: string, updatePromotionSiteDto: UpdatePromotionSiteDto) {
    return this.promotionSitesModel
      .findByIdAndUpdate(
        id,
        { $set: updatePromotionSiteDto },
        { new: true }, // 새로 반환된 문서 업데이트
      )
      .lean();
  }

  async deleteSite(id: string): Promise<any> {
    return this.promotionSitesModel.deleteOne({ _id: id });
  }

  async getNodes() {
    return this.promotionNodesModel.find({ use: true }).sort({order: 1}).lean();
  }

  async getNodesByParentId(parentId: string) {
    return this.promotionNodesModel
      .find({
        parentId,
        use: true,
      })
      .sort({ order: 1 })
      .lean();
  }

  async getNodeById(id: string) {
    return this.promotionNodesModel
      .findOne({
        _id: id,
        use: true,
      })
      .lean();
  }

  async getNodeFileLastIndex(parentId: string) {
    return this.promotionNodesModel
      .find({ parentId, category: 'file' })
      .sort({ order: 1 })
      .lean();
  }

  async createDirectory(createPromotionNodeDto: CreatePromotionNodeDto) {
    return await this.promotionNodesModel.create({
      ...createPromotionNodeDto,
      category: 'directory',
    });
  }

  async createFiles(savedDtos: any[]) {
    // 여러 개의 파일 업로드 가능하므로 map 사용
    return await this.promotionNodesModel.create(
      savedDtos.map((dto) => ({
        ...dto,
        category: 'file',
      })),
    );
  }

  async updateNodeName(id: string, name: string) {
    return this.promotionNodesModel
      .findByIdAndUpdate(
        id,
        { $set: { name: name } },
        { new: true }, // 새로 반환된 문서 업데이트
      )
      .lean();
  }

  async deleteNode(id: string): Promise<any> {
    return this.promotionNodesModel.deleteOne({ _id: id });
  }

  async getRecentDocuments() {
    return this.promotionNodesModel
      .find({ use: true, category: 'file' })
      .sort({ createdAt: -1 })
      .limit(4)
      .lean();
  }

  async search(keyword: string) {
    return this.promotionNodesModel
      .find({
        use: true,
        name: { $regex: keyword, $options: 'i' },
      })
      .lean();
  }

  async updateNodePath(id: string, path: string): Promise<PromotionNodeDto> {
    return this.promotionNodesModel
      .findByIdAndUpdate(
        id,
        { $set: { path, updatedAt: new Date() } },
        { new: true },
      )
      .lean();
  }

  async updateDirectorySize(
    id: string,
    size: number,
  ): Promise<PromotionNodeDto> {
    return this.promotionNodesModel
      .findByIdAndUpdate(
        id,
        { $set: { size, updatedAt: new Date() } },
        { new: true },
      )
      .lean();
  }

  async getAuthUsers() {
    return this.promotionAuthModel.find().lean();
  }

  async bulkWriteNodes(ops: any): Promise<any> {
    return this.promotionNodesModel.bulkWrite(ops);
  }
} 