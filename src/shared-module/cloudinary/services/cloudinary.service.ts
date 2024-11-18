import { Injectable } from '@nestjs/common';
import {
  UploadApiErrorResponse,
  UploadApiResponse,
  v2 as cloudinary,
} from 'cloudinary';
const streamifier = require('streamifier');

@Injectable()
export class CloudinaryService {
  private async uploadToCloudinary(
    file: Express.Multer.File,
  ): Promise<UploadApiResponse | UploadApiErrorResponse> {
    const resourceType = file.mimetype.startsWith('video/') ? 'video' : 'image';

    return new Promise<UploadApiResponse | UploadApiErrorResponse>(
      (resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            resource_type: resourceType,
          },
          (error: UploadApiErrorResponse, result: UploadApiResponse) => {
            if (error) return reject(error);
            resolve(result);
          },
        );

        streamifier.createReadStream(file.buffer).pipe(uploadStream);
      },
    );
  }

  // Method to upload a single file to Cloudinary
  async uploadFile(
    file: Express.Multer.File,
  ): Promise<UploadApiResponse | UploadApiErrorResponse> {
    return this.uploadToCloudinary(file);
  }

  // Method to upload multiple files to Cloudinary concurrently
  async uploadFiles(
    files: Express.Multer.File[],
  ): Promise<(UploadApiResponse | UploadApiErrorResponse)[]> {
    // Map each file to a promise for uploading to Cloudinary concurrently
    const uploadPromises = files.map((file) => this.uploadToCloudinary(file));

    // Wait for all promises to resolve using Promise.all
    return Promise.all(uploadPromises);
  }
}

