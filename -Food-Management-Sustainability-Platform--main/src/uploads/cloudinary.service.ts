

import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { v2 as cloudinary, UploadApiResponse } from 'cloudinary';
import { Express } from 'express';

@Injectable()
export class CloudinaryService {
  private readonly logger = new Logger(CloudinaryService.name);

  constructor() {
    // .env theke nibe – nijer value boshayo
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });
  }

  async uploadFile(
    file: Express.Multer.File,
    folder = 'receipts',
  ): Promise<UploadApiResponse> {
    if (!file) {
      throw new BadRequestException('No file provided');
    }

    // ▶ PDF + image requirements
    // - Allowed types: JPG, PNG, PDF
    // - Max size: 5MB
    const allowedMimeTypes = [
      'image/jpeg',
      'image/jpg',
      'image/png',
      'application/pdf',
    ];

    if (!allowedMimeTypes.includes(file.mimetype)) {
      throw new BadRequestException(
        `Invalid file type: ${file.mimetype}. Only JPG, PNG & PDF allowed.`,
      );
    }

    const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
    if (file.size > MAX_FILE_SIZE) {
      throw new BadRequestException(
        `File too large (${Math.round(
          file.size / (1024 * 1024),
        )}MB). Max 5MB allowed.`,
      );
    }

    return new Promise<UploadApiResponse>((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder,
          resource_type: 'auto', // image + pdf both
        },
        (error, result) => {
          if (error) {
            this.logger.error('Cloudinary upload error', error);
            return reject(
              new InternalServerErrorException(
                'Failed to upload file to Cloudinary',
              ),
            );
          }
          if (!result) {
            return reject(
              new InternalServerErrorException(
                'No result returned from Cloudinary',
              ),
            );
          }
          resolve(result);
        },
      );

      uploadStream.end(file.buffer);
    });
  }
}
