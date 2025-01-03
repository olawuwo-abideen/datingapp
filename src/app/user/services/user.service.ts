import { BadRequestException, Injectable } from '@nestjs/common';
import {
  DeepPartial,
  FindOptionsWhere,
  Repository,
  UpdateResult,
} from 'typeorm';
import { User } from '../../../shared-module/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcryptjs from 'bcryptjs';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';
import { ChangePasswordDto } from '../dto/change-password.dto';
import { UpdateProfileVisibilityDto, UpdateProfileDto } from '../dto/update-profile.dto';
import { CloudinaryService } from '../../../shared-module/cloudinary/services/cloudinary.service';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  public async findOne(where: FindOptionsWhere<User>): Promise<User | null> {
    return await this.userRepository.findOne({ where });
  }

  // create verification code
  public async create(data: DeepPartial<User>): Promise<User> {
    const user: User = await this.userRepository.create(data);
    return await this.userRepository.save(user);
  }

  // update verification code
  public async update(
    where: FindOptionsWhere<User>,
    data: QueryDeepPartialEntity<User>,
  ): Promise<UpdateResult> {
    return await this.userRepository.update(where, data);
  }

  public async exists(where: FindOptionsWhere<User>): Promise<boolean> {
    const user: boolean = await this.userRepository.existsBy(where);

    return user;
  }

  public async profile(user: User) {
    return {
      ...user,
    };
  }

  public async changePassword(
    data: ChangePasswordDto,
    user: User,
  ): Promise<null> {
 
  
    // Refetch the user to ensure the password is included
    if (!user.password) {
      user = await this.userRepository.findOne({
        where: { id: user.id },
      });
  
      if (!user || !user.password) {
        throw new BadRequestException('No password found for the user.');
      }
    }
  
    
    const isCurrentPasswordValid = await bcryptjs.compare(
      data.currentPassword,
      user.password,
    );
    if (!isCurrentPasswordValid) {
      throw new BadRequestException(
        'The password you entered does not match your current password.',
      );
    }
  
    if (data.password !== data.confirmPassword) {
      throw new BadRequestException(
        'New password and confirmation do not match.',
      );
    }
  
    const saltRounds = 10;
  
    
    const hashedNewPassword = await bcryptjs.hash(data.password, saltRounds);
  
    await this.update(
      { id: user.id },
      { password: hashedNewPassword },
    );
  
    return null;
  }
  
  public async updateProfile(
    data: UpdateProfileDto,
    user: User,
  ): Promise<User> {
    // Prepare data to update
    const dataToUpdate: Partial<User> = {
      firstname: data.firstname,
      lastname: data.lastname,
      age: data.age,
      phone: data.phone,
      location: data.location,
      preferences: data.preferences,
    };
  
    Object.assign(user, dataToUpdate);
  
    // Update user record in the database
    await this.userRepository.save(user);
  
    return user;
  }

  
  
  public async updateProfileImage(
    profileimage: Express.Multer.File,
    user: User,
  ): Promise<User> {
    // Upload header image to Cloudinary
    if (profileimage) {
      const uploadHeaderImage = await this.cloudinaryService.uploadFile(profileimage);
      user.profileimage = uploadHeaderImage.secure_url;
    }
  
    // Update user record in the database
    await this.userRepository.save(user);
  
    return user;
  }

  public async profileVisibility(
    data: UpdateProfileVisibilityDto,
    user: User,
  ): Promise<User> {
    // Prepare data to update
    const dataToUpdate: Partial<User> = {
      profilevisibility: data.profilevisibility,
    };
  
    Object.assign(user, dataToUpdate);
    // Update user record in the database
    await this.userRepository.save(user);
  
    return user;
  }
  
  
public async deleteUser(where: FindOptionsWhere<User>): Promise<UpdateResult> {
    return await this.userRepository.softDelete(where);
  }    


}
