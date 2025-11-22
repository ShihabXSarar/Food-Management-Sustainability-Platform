
import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CloudinaryService } from './cloudinary.service';
import { Upload, UploadDocument } from './schemas/upload.schema';
import { Express } from 'express';

@Injectable()
export class UploadService {
  private readonly logger = new Logger(UploadService.name);

  constructor(
    private readonly cloudinaryService: CloudinaryService,
    @InjectModel(Upload.name)
    private readonly uploadModel: Model<UploadDocument>,
  ) {}

  async uploadReceipt(userId: string, file: Express.Multer.File) {
    if (!userId) {
      throw new BadRequestException('User id is required');
    }

    if (!Types.ObjectId.isValid(userId)) {
      throw new BadRequestException('Invalid user id');
    }

    if (!file) {
      throw new BadRequestException('No file received');
    }

    try {
      const result = await this.cloudinaryService.uploadFile(file, 'receipts');

      const created = await this.uploadModel.create({
        user: new Types.ObjectId(userId),
        url: result.secure_url,
        publicId: result.public_id,
        originalName: file.originalname,
        mimeType: file.mimetype,
        size: file.size,
        folder: 'receipts',
        type: 'receipt',
      });

      return created;
    } catch (error: any) {
      this.logger.error(
        'Error in uploadReceipt',
        error?.stack || JSON.stringify(error),
      );
      throw new InternalServerErrorException('Receipt upload failed');
    }
  }

  async getMyReceipts(userId: string) {
    if (!Types.ObjectId.isValid(userId)) {
      throw new BadRequestException('Invalid user id');
    }

    return this.uploadModel
      .find({ user: new Types.ObjectId(userId), type: 'receipt' })
      .sort({ createdAt: -1 })
      .lean();
  }
}
