import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcryptjs from 'bcryptjs'
import { VerificationCode } from '../../../shared-module/entities/verification-code.entity';
import {
  DeepPartial,
  DeleteResult,
  FindOneOptions,
  FindOptionsWhere,
  Repository,
  UpdateResult,
} from 'typeorm';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';

@Injectable()
export class VerificationService {
  constructor(
    @InjectRepository(VerificationCode)
    private readonly verificationRepository: Repository<VerificationCode>,
  ) {}

  // create verification code
  public async create(
    data: DeepPartial<VerificationCode>,
  ): Promise<VerificationCode> {
    const verificationCode: VerificationCode =
      this.verificationRepository.create(data);
    return await this.verificationRepository.save(verificationCode);
  }

  // update verification code
  public async update(
    where: FindOptionsWhere<VerificationCode>,
    data: QueryDeepPartialEntity<VerificationCode>,
  ): Promise<UpdateResult> {
    return await this.verificationRepository.update(where, data);
  }

  // get a verification code
  public async findOne(
    options: FindOneOptions<VerificationCode>,
  ): Promise<VerificationCode | null> {
    return await this.verificationRepository.findOne(options);
  }

  // find a verification code by id
  public async findOneById(id: string): Promise<VerificationCode | null> {
    return await this.findOne({ where: { id } });
  }

  public async findOneAndVerify(
    where: FindOptionsWhere<VerificationCode>,
    code: string,
  ): Promise<VerificationCode | null> {
    const verificationCode: VerificationCode | null = await this.findOne({
      where,
      order: { createdAt: 'DESC' },
    });

    if (!verificationCode) return null;

    // verify verification cdoe
    const verifyCode: boolean = await this.verify(verificationCode?.code, code);

    if (!verifyCode) return null;

    return verificationCode;
  }

  // delete verification code
  public async delete(
    where: FindOptionsWhere<VerificationCode>,
  ): Promise<DeleteResult> {
    return await this.verificationRepository.delete(where);
  }

  // hash
  public async hash(data: string): Promise<string> {
    return await bcryptjs.hash(data, 10);
  }

  // verify encrypted code
  public async verify(encrypted: string, data: string): Promise<boolean> {
    return await bcryptjs.compare(encrypted, data);
  }

  // generate otp code
  public code(length: number): string {
    const characters = '0123456789';
    let OTP = '';

    for (let i = 0; i < length; i++) {
      const index = Math.floor(Math.random() * characters.length);
      OTP += characters[index];
    }

    return OTP;
  }

  // mark verification code as verified
  public async markAsVerified(id: string): Promise<boolean> {
    const updateVerificationCode: UpdateResult =
      await this.verificationRepository.update(
        { id },
        { verifiedAt: new Date(), verified: true },
      );
    return updateVerificationCode ? true : false;
  }

  // check if verification code has expired
  public async expired(verificationCode: VerificationCode): Promise<boolean> {
    if (
      verificationCode?.expiresAt &&
      verificationCode?.expiresAt < new Date()
    ) {
      return true;
    }
    return false;
  }

  // check if verification code has been verified
  public verified(verificationCode: VerificationCode): boolean {
    return verificationCode?.verifiedAt ? true : false;
  }

  public async findOneAndCheckIsVerified(
    where: FindOptionsWhere<VerificationCode>,
  ): Promise<VerificationCode | null> {
    // find Verification code
    const verificationCode: VerificationCode | null = await this.findOne({
      where,
      order: { createdAt: 'DESC' },
    });
    // check if verification code has been verified
    if (!verificationCode || !this.verified(verificationCode)) {
      return null;
    }
    return verificationCode;
  }
}
