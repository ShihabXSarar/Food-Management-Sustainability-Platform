import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Upload, UploadDocument } from './schemas/upload.schema';
import { Express } from 'express';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class UploadService {
  private readonly logger = new Logger(UploadService.name);

  constructor(
    @InjectModel(Upload.name)
    private readonly uploadModel: Model<UploadDocument>,
  ) { }

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
      // Local Storage Logic
      const uploadDir = path.join(process.cwd(), 'uploads', 'receipts');
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }

      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
      const ext = path.extname(file.originalname);
      const filename = `${file.fieldname}-${uniqueSuffix}${ext}`;
      const filepath = path.join(uploadDir, filename);

      fs.writeFileSync(filepath, file.buffer);

      const fileUrl = `http://localhost:3000/uploads/receipts/${filename}`;

      const created = await this.uploadModel.create({
        user: new Types.ObjectId(userId),
        url: fileUrl,
        publicId: filename, // Using filename as publicId for local
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
