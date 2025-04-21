import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import {
  Gender,
  ProfileVisibility,
  User,
  UserPlan,
  UserRole,
  UserStatus,
} from '../../../shared-module/entities/user.entity';
import { Repository } from 'typeorm';
import { CloudinaryService } from '../../../shared-module/cloudinary/services/cloudinary.service';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import * as bcryptjs from 'bcryptjs';
import { UpdateProfileDto } from '../dto/update-profile.dto';

jest.mock('bcryptjs', () => ({
  hash: jest.fn(),
  compare: jest.fn(),
}));

describe('UserService', () => {
  let service: UserService;
  let userRepository: Repository<User>;
  let cloudinaryService: CloudinaryService;

  const mockUser: User = {
    id: 'user-id',
    firstname: 'Test',
    lastname: 'User',
    email: 'test@example.com',
    phone: '+123456789',
    age: 25,
    gender: Gender.MALE,
    profilevisibility: ProfileVisibility.PUBLIC,
    plan: UserPlan.FREE,
    userstatus: UserStatus.ACTIVE,
    location: {
      latitude: 0,
      longitude: 0,
    },
    preferences: {
      interestedIn: ['Female'],
      ageRange: {
        min: 18,
        max: 35,
      },
      distance: 50,
    },
    password: 'hashedPassword',
    createdAt: new Date(),
    updatedAt: new Date(),
    role: UserRole.ADMIN,
    resetToken: null,
    deletedAt: null,
  };

  const mockRepository = {
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    update: jest.fn(),
    existsBy: jest.fn(),
  };

  const mockCloudinaryService = {
    uploadFile: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getRepositoryToken(User),
          useValue: mockRepository,
        },
        {
          provide: CloudinaryService,
          useValue: mockCloudinaryService,
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));
    cloudinaryService = module.get<CloudinaryService>(CloudinaryService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create and save a user', async () => {
      mockRepository.create.mockReturnValue(mockUser);
      mockRepository.save.mockResolvedValue(mockUser);

      const result = await service.create(mockUser);
      expect(result).toEqual(mockUser);
      expect(mockRepository.save).toHaveBeenCalledWith(mockUser);
    });
  });

  describe('changePassword', () => {
    it('should change the password successfully', async () => {
      const changePasswordDto = {
        currentPassword: 'currentPassword',
        password: 'newPassword',
        confirmPassword: 'newPassword',
      };

      mockRepository.findOne.mockResolvedValue({ ...mockUser, password: 'hashedPassword' });
      (bcryptjs.compare as jest.Mock).mockResolvedValue(true); // ✅ return true for success
      mockRepository.update.mockResolvedValue({ affected: 1 });

      const result = await service.changePassword(changePasswordDto, mockUser);

      expect(result.message).toBe('Password updated successfully.');
      expect(mockRepository.update).toHaveBeenCalledWith(
        { id: mockUser.id },
        { password: expect.any(String) },
      );
    });

    it('should throw BadRequestException if current password is incorrect', async () => {
      const changePasswordDto = {
        currentPassword: 'wrongPassword',
        password: 'newPassword',
        confirmPassword: 'newPassword',
      };

      mockRepository.findOne.mockResolvedValue({ ...mockUser, password: 'hashedPassword' });
      (bcryptjs.compare as jest.Mock).mockResolvedValue(false);

      await expect(service.changePassword(changePasswordDto, mockUser)).rejects.toThrow(
        new BadRequestException('The password you entered does not match your current password.'),
      );
    });

    it('should throw BadRequestException if passwords do not match', async () => {
      const changePasswordDto = {
        currentPassword: 'currentPassword',
        password: 'newPassword',
        confirmPassword: 'differentPassword',
      };

      await expect(service.changePassword(changePasswordDto, mockUser)).rejects.toThrow(
        new BadRequestException('New password and confirmation do not match.'),
      );
    });
  });

  describe('updateProfile', () => {
    it('should update the user profile successfully', async () => {
      const updateProfileDto: UpdateProfileDto = {
        firstname: 'John',
        lastname: 'Doe',
        age: 30,
        phone: '+1234567890',
        gender: Gender.MALE,
        location: {
          latitude: 37.7749,
          longitude: -122.4194,
        },
        preferences: {
          interestedIn: ['Female'],
          ageRange: {
            min: 25,
            max: 35,
          },
          distance: 50,
        },
      };

      mockRepository.save.mockResolvedValue({ ...mockUser, ...updateProfileDto });

      const result = await service.updateProfile(updateProfileDto, mockUser);
      expect(result.message).toBe('Profile updated successfully.');
      expect(result.data.firstname).toBe(updateProfileDto.firstname);
    });
  });

  describe('getUserProfileById', () => {
    it('should return user profile by ID', async () => {
      mockRepository.findOne.mockResolvedValue(mockUser);

      const result = await service.getUserProfileById({ id: mockUser.id });
      expect(result.message).toBe('User profile retrieved successfully.');
      expect(result.data).toEqual(mockUser);
    });

    it('should throw NotFoundException if user not found', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.getUserProfileById({ id: 'non-existing-id' })).rejects.toThrow(
        new NotFoundException('User with ID non-existing-id not found.'),
      );
    });
  });

  describe('updateProfileImage', () => {
    it('should update profile image', async () => {
      const mockFile = { originalname: 'profile.jpg' } as Express.Multer.File;
      mockCloudinaryService.uploadFile.mockResolvedValue({ secure_url: 'https://some-url.com' });

      const result = await service.updateProfileImage(mockFile, mockUser);
      expect(result.message).toBe('Profile image updated successfully.');
      expect(result.data.profileimage).toBe('https://some-url.com');
    });
  });

  describe('profileVisibility', () => {
    it('should update profile visibility successfully', async () => {
      const updateVisibilityDto = { profilevisibility: ProfileVisibility.PRIVATE };
      mockRepository.save.mockResolvedValue({ ...mockUser, profilevisibility: ProfileVisibility.PRIVATE });

      const result = await service.profileVisibility(updateVisibilityDto, mockUser);
      expect(result.message).toBe('Profile visibility updated successfully.');
      expect(result.data.profilevisibility).toBe(ProfileVisibility.PRIVATE); 
    });
  });
});
