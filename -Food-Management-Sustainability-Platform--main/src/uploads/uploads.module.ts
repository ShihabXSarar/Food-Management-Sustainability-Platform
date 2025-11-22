// src/upload/upload.module.ts
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CloudinaryService } from './cloudinary.service';
import { UploadController } from './uploads.controller';
import { UploadService } from './uploads.service';
import { Upload, UploadSchema } from './schemas/upload.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Upload.name, schema: UploadSchema }]),
  ],
  controllers: [UploadController],
  providers: [CloudinaryService, UploadService],
  exports: [UploadService],
})
export class UploadModule {}
