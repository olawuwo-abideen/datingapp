import { BadRequestException, Injectable } from '@nestjs/common';
import {
  DeepPartial,
  FindOptionsWhere,
  Repository,
  UpdateResult,
} from 'typeorm';
import { User, UserRole } from '../../shared-module/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcryptjs from 'bcryptjs'
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';
import { ChangePasswordDto } from './dto/change-password.dto';
import {  UpdateProfileDto } from './dto/update-profile.dto';
import { CloudinaryService } from '../../shared-module/cloudinary/services/cloudinary.service';
import { UpdateVisibilityDto } from './dto/update-profile-visibility.dto';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User) private readonly userRepository: Repository<User>,
        private readonly cloudinaryService: CloudinaryService
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
        // Verify if user current password match
        if (!(await bcryptjs.compare(user.password, data.currentPassword))) {
          throw new BadRequestException(
            'The password you entered does not match your current password.',
          );
        }
    
        // hash new password
        const newPassword = await bcryptjs.hash(data.password, 10);
    
        // update user password
        await this.update(
          { id: user.id },
          {
            password: newPassword,
          },
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
        profileImage: Express.Multer.File,
        user: User,
      ): Promise<User> {
        if (profileImage) {
          const uploadProfileImage = await this.cloudinaryService.uploadFile(profileImage);
          user.profileimage = uploadProfileImage.secure_url;
        }
        await this.userRepository.save(user);
      
        return user;
      }


      public async profileVisibility(
        data: UpdateVisibilityDto,
        user: User,
      ): Promise<User> {
        // Prepare data to update
        const dataToUpdate: Partial<User> = {
          profilevisible: data.profilevisible,
        };
      
        Object.assign(user, dataToUpdate);
        // Update user record in the database
        await this.userRepository.save(user);
      
        return user;
      }
      
      

}
