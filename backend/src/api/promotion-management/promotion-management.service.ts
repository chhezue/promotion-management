import { Injectable } from '@nestjs/common';
import { PromotionManagementRepository } from './promotion-management.repository';
import {
  CreatePromotionSiteDto,
  UpdatePromotionSiteDto,
  GetPromotionSitesDto,
  GetPromotionSiteDto,
} from './dto/promotion-site-dto';
import { StorageService } from '../storage/storage.service';
import {
  CreatePromotionNodeDto,
  GetAuthUsersDto,
  GetPromotionNodeDto,
  GetPromotionNodesDto,
  PromotionNodeDto,
} from './dto/promotion-node-dto';
import { ObjectId } from 'mongodb';
import * as archiver from 'archiver';
import { Response } from 'express';
import { Readable } from 'stream';
import * as dayjs from 'dayjs';

@Injectable()
export class PromotionManagementService {
  constructor(
    private readonly promotionManagementRepository: PromotionManagementRepository,
    private readonly storageService: StorageService,
  ) {}

  // 모든 바로가기 사이트 출력
  async getSites(): Promise<GetPromotionSitesDto> {
    try {
      const sites = await this.promotionManagementRepository.getSites();

      if (sites) {
        return {
          result: true,
          sites,
        };
      } else {
        return { result: false, msg: '사이트를 찾을 수 없습니다.', sites: [] };
      }
    } catch (e) {
      return {
        result: false,
        msg: '사이트를 불러오는 데 문제가 발생하였습니다.',
        sites: [],
      };
    }
  }

  // 바로가기 사이트 생성
  async createSite(
    createPromotionSiteDto: CreatePromotionSiteDto,
  ): Promise<GetPromotionSiteDto> {
    try {
      const site = await this.promotionManagementRepository.createSite(
        createPromotionSiteDto,
      );

      if (site) {
        return {
          result: true,
          site,
        };
      } else {
        return {
          result: false,
          msg: '사이트를 생성할 수 없습니다.',
          site: null,
        };
      }
    } catch (e) {
      return {
        result: false,
        msg: '사이트를 생성하는 데 문제가 발생하였습니다.',
        site: null,
      };
    }
  }

  // 바로가기 사이트 수정
  async updateSite(
    id: string,
    updatePromotionSiteDto: UpdatePromotionSiteDto,
  ): Promise<GetPromotionSiteDto> {
    try {
      const site = await this.promotionManagementRepository.updateSite(
        id,
        updatePromotionSiteDto,
      );

      if (site) {
        return {
          result: true,
          site,
        };
      } else {
        return {
          result: false,
          msg: '사이트를 수정할 수 없습니다.',
          site: null,
        };
      }
    } catch (e) {
      return {
        result: false,
        msg: '사이트를 수정하는 데 문제가 발생하였습니다.',
        site: null,
      };
    }
  }

  // 바로가기 사이트 삭제
  async deleteSite(id: string): Promise<GetPromotionSiteDto> {
    try {
      const result = await this.promotionManagementRepository.deleteSite(id);

      if (result.deletedCount === 1) {
        return {
          result: true,
          site: null,
        };
      } else {
        return {
          result: false,
          msg: '사이트를 삭제할 수 없습니다.',
          site: null,
        };
      }
    } catch (e) {
      return {
        result: false,
        msg: '사이트를 삭제하는 데 문제가 발생하였습니다.',
        site: null,
      };
    }
  }

  // 트리 구조로 변환
  private buildTree(
    nodes: PromotionNodeDto[],
    parentId?: string | ObjectId | null,
  ): PromotionNodeDto[] {
    return nodes
      .filter((node) => {
        const currentParentId = node.parentId ? node.parentId.toString() : null;
        const targetParentId = parentId ? parentId.toString() : null;
        return currentParentId === targetParentId;
      })
      .map((node) => {
        const children = this.buildTree(nodes, node._id.toString());
        return children.length > 0 ? { ...node, children } : { ...node };
      });
  }

  // 등록된 모든 노드 조회
  async getNodes(): Promise<GetPromotionNodesDto> {
    try {
      const flatNodes = await this.promotionManagementRepository.getNodes();

      if (!flatNodes || flatNodes.length === 0) {
        return {
          result: false,
          msg: '해당하는 폴더 및 파일들을 찾을 수 없습니다.',
          nodes: [],
        };
      }

      const treeNodes = this.buildTree(flatNodes);

      return {
        result: true,
        nodes: treeNodes,
      };
    } catch (e) {
      return {
        result: false,
        msg: '해당하는 폴더 및 파일들을 불러오는 데 문제가 발생하였습니다.',
        nodes: [],
      };
    }
  }

  // 특정 노드 조회
  async getNodeById(id: string): Promise<GetPromotionNodeDto> {
    try {
      const node = await this.promotionManagementRepository.getNodeById(id);

      if (node) {
        return {
          result: true,
          node,
        };
      } else {
        return {
          result: false,
          msg: '해당 파일 및 폴더를 찾을 수 없습니다.',
          node: null,
        };
      }
    } catch (e) {
      return {
        result: false,
        msg: '해당 파일 및 폴더를 불러오는 데 문제가 발생하였습니다.',
        node: null,
      };
    }
  }

  // 직속 자식 노드만 조회
  async getImmediateNode(parentId: string): Promise<GetPromotionNodesDto> {
    try {
      const nodes = await this.promotionManagementRepository.getNodesByParentId(parentId);

      return {
        result: true,
        nodes,
      };
    } catch (e) {
      return {
        result: false,
        msg: '자식 노드를 불러오는 데 문제가 발생하였습니다.',
        nodes: [],
      };
    }
  }

  // 폴더 생성
  async createDirectory(
    createPromotionNodeDto: CreatePromotionNodeDto,
  ): Promise<GetPromotionNodeDto> {
    try {
      const directory = await this.promotionManagementRepository.createDirectory(
        createPromotionNodeDto,
      );

      if (directory) {
        return {
          result: true,
          node: directory,
        };
      } else {
        return {
          result: false,
          msg: '폴더를 생성할 수 없습니다.',
          node: null,
        };
      }
    } catch (e) {
      return {
        result: false,
        msg: '폴더를 생성하는 데 문제가 발생하였습니다.',
        node: null,
      };
    }
  }

  // 파일 업로드
  async createFiles(
    files: Express.Multer.File[],
    createPromotionNodeDto: CreatePromotionNodeDto,
  ): Promise<GetPromotionNodesDto> {
    try {
      const savedDtos = await Promise.all(
        files.map(async (file) => {
          const key = this.storageService.generateFileKey('promotion-management', file.filename);
          const fileUrl = await this.storageService.uploadFile(file, key);
          
          return {
            ...createPromotionNodeDto,
            name: file.filename,
            size: file.size,
            fileUrl,
            path: key,
          };
        }),
      );

      const createdFiles = await this.promotionManagementRepository.createFiles(savedDtos);

      return {
        result: true,
        nodes: createdFiles,
      };
    } catch (e) {
      return {
        result: false,
        msg: '파일 업로드 중 문제가 발생하였습니다.',
        nodes: [],
      };
    }
  }

  // 노드 이름 수정
  async updateNodeName(id: string, name: string): Promise<GetPromotionNodeDto> {
    try {
      const updatedNode = await this.promotionManagementRepository.updateNodeName(id, name);

      if (updatedNode) {
        return {
          result: true,
          node: updatedNode,
        };
      } else {
        return {
          result: false,
          msg: '노드 이름을 수정할 수 없습니다.',
          node: null,
        };
      }
    } catch (e) {
      return {
        result: false,
        msg: '노드 이름 수정 중 문제가 발생하였습니다.',
        node: null,
      };
    }
  }

  // 노드 삭제
  async deleteNode(id: string): Promise<GetPromotionNodeDto> {
    try {
      const result = await this.promotionManagementRepository.deleteNode(id);

      if (result.deletedCount === 1) {
        return {
          result: true,
          node: null,
        };
      } else {
        return {
          result: false,
          msg: '노드를 삭제할 수 없습니다.',
          node: null,
        };
      }
    } catch (e) {
      return {
        result: false,
        msg: '노드 삭제 중 문제가 발생하였습니다.',
        node: null,
      };
    }
  }

  // 최근 문서 조회
  async getRecentDocuments(): Promise<GetPromotionNodesDto> {
    try {
      const nodes = await this.promotionManagementRepository.getRecentDocuments();

      return {
        result: true,
        nodes,
      };
    } catch (e) {
      return {
        result: false,
        msg: '최근 문서를 불러오는 데 문제가 발생하였습니다.',
        nodes: [],
      };
    }
  }

  // 검색
  async search(keyword: string): Promise<GetPromotionNodesDto> {
    try {
      const searchNodes = await this.promotionManagementRepository.search(keyword);

      if (!searchNodes || searchNodes.length === 0) {
        return {
          result: false,
          msg: `'${keyword}'에 대한 검색 결과가 없습니다.`,
          nodes: [],
        };
      }

      return {
        result: true,
        nodes: searchNodes,
      };
    } catch (e) {
      return {
        result: false,
        msg: '검색 결과를 불러오는 데 문제가 발생하였습니다.',
        nodes: [],
      };
    }
  }

  // 노드 복사
  async copyNode(targetId: string): Promise<GetPromotionNodesDto> {
    try {
      const target = await this.promotionManagementRepository.getNodeById(targetId);

      if (!target) {
        return {
          result: false,
          msg: '해당 파일 및 폴더를 찾을 수 없습니다.',
          nodes: [],
        };
      }

      const newName = `${target.name} (복사본)`;
      const copiedNode = {
        ...target,
        _id: new ObjectId(),
        name: newName,
      };

      if (target.category === 'directory') {
        await this.promotionManagementRepository.createDirectory(copiedNode);
      } else {
        await this.promotionManagementRepository.createFiles([copiedNode]);
      }

      return {
        result: true,
        msg: '복사에 성공했습니다.',
        nodes: [copiedNode],
      };
    } catch (error) {
      return {
        result: false,
        msg: '복사 중 오류가 발생했습니다.',
        nodes: [],
      };
    }
  }

  // 압축 다운로드 (간략화)
  async downloadDirectoryAsZip(nodeId: string, res: Response): Promise<void> {
    try {
      const rootNode = await this.promotionManagementRepository.getNodeById(nodeId);
      
      if (!rootNode || rootNode.category !== 'directory') {
        res.status(404).json({
          result: false,
          msg: '해당 폴더를 찾을 수 없습니다.',
        });
        return;
      }

      const archive = archiver('zip', { zlib: { level: 9 } });
      
      res.setHeader('Content-Type', 'application/zip');
      res.setHeader(
        'Content-Disposition',
        `attachment; filename="${encodeURIComponent(rootNode.name)}.zip"`,
      );

      archive.pipe(res);
      await archive.finalize();
    } catch (e) {
      res.status(500).json({
        result: false,
        msg: '압축 다운로드 중 문제가 발생하였습니다.',
      });
    }
  }

  // 권한 사용자 조회
  async getAuthUsers(): Promise<GetAuthUsersDto> {
    try {
      const authUsers = await this.promotionManagementRepository.getAuthUsers();

      return {
        result: true,
        authUsers,
      };
    } catch (e) {
      return {
        result: false,
        msg: '권한 목록을 불러오는 데 문제가 발생하였습니다.',
        authUsers: [],
      };
    }
  }

  // 노드 순서 업데이트
  async updateNodePosition(
    parentId: string,
    body: { content: Array<{ _id: string; order: number }> },
  ): Promise<GetPromotionNodesDto> {
    try {
      const ops = body.content.map((item) => ({
        updateOne: {
          filter: { _id: item._id },
          update: { $set: { order: item.order } },
        },
      }));

      await this.promotionManagementRepository.bulkWriteNodes(ops);

      return {
        result: true,
        nodes: [],
      };
    } catch (e) {
      return {
        result: false,
        msg: '노드 순서 업데이트 중 문제가 발생하였습니다.',
        nodes: [],
      };
    }
  }
} 