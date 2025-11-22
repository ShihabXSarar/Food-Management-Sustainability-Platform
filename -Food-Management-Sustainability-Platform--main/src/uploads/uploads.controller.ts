// src/uploads/uploads.controller.ts  (or src/upload/upload.controller.ts)
import {
  BadRequestException,
  Controller,
  Get,
  Logger,
  Post,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from '../auth/jwt-auth.guard'; // path adjust korba
import { UploadService } from './uploads.service';
import type { Express } from 'express';


@Controller('uploads')
export class UploadController {
  private readonly logger = new Logger(UploadController.name);

  constructor(private readonly uploadService: UploadService) {}

  // 👉 helper: token theke userId ber kora
  private getUserIdFromReq(req: any): string {
    const userId =
      req.user?.id || req.user?._id || req.user?.userId || req.user?.sub;

    if (!userId) {
      throw new BadRequestException(
        'User id not found in JWT payload. Check JwtStrategy.validate() return object.',
      );
    }

    return String(userId);
  }

  // 🚨 TEST ROUTE (no auth) – sudhu check korar jonno je Multer file pacche kina
  // POST /uploads/test
  @Post('test')
  @UseInterceptors(FileInterceptor('file')) // ⬅⬅⬅ FIELD NAME EXACTLY "file"
  async testUpload(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException(
        'No file received. Make sure form-data field name is "file".',
      );
    }

    this.logger.log(
      `Test upload: file received -> ${file.originalname}, mime=${file.mimetype}, size=${file.size}`,
    );

    return {
      message: 'Test upload OK',
      file: {
        originalName: file.originalname,
        mimeType: file.mimetype,
        size: file.size,
      },
    };
  }

  // 🧾 MAIN: protected receipt upload
  // POST /uploads/receipt
  @UseGuards(JwtAuthGuard)
  @Post('receipt')
  @UseInterceptors(FileInterceptor('file')) // ⬅⬅⬅ EI LINE TA JORURI
  async uploadReceipt(
    @Req() req: any,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const userId = this.getUserIdFromReq(req);

    if (!file) {
      throw new BadRequestException(
        'No file received. Make sure form-data field name is "file".',
      );
    }

    this.logger.log(
      `Receipt upload: user=${userId}, file=${file.originalname}, mime=${file.mimetype}, size=${file.size}`,
    );

    const uploaded = await this.uploadService.uploadReceipt(userId, file);

    return {
      message: 'Receipt uploaded successfully',
      data: uploaded,
    };
  }

  // GET /uploads/receipt/me
  @UseGuards(JwtAuthGuard)
  @Get('receipt')
  async getMyReceipts(@Req() req: any) {
    const userId = this.getUserIdFromReq(req);
    const receipts = await this.uploadService.getMyReceipts(userId);

    return {
      message: 'My receipts fetched',
      count: receipts.length,
      data: receipts,
    };
  }
}
