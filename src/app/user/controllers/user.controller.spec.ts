import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from '../services/user.service';
import { User, UserRole, UserStatus } from '../../../shared-module/entities/user.entity';
import {
  ChangePasswordDto,
} from '../dto/change-password.dto';
import {
  UpdateProfileDto,
  UpdateProfileVisibilityDto,
  UpdatePlan,
} from '../dto/update-profile.dto';
import { Gender, ProfileVisibility, UserPlan } from '../../../shared-module/entities/user.entity';

describe('UserController', () => {
  let controller: UserController;
  let service: UserService;

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
    deletedAt: null
  };
  

  const mockUserService = {
    profile: jest.fn(),
    changePassword: jest.fn(),
    updateProfile: jest.fn(),
    updateProfileImage: jest.fn(),
    profileVisibility: jest.fn(),
    updatePlan: jest.fn(),
    getUserProfileById: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: UserService,
          useValue: mockUserService,
        },
      ],
    }).compile();

    controller = module.get<UserController>(UserController);
    service = module.get<UserService>(UserService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return user profile', async () => {
    const req = { user: mockUser };
    await controller.getProfile(req as any);
    expect(service.profile).toHaveBeenCalledWith(mockUser);
  });

  it('should change user password', async () => {
    const dto: ChangePasswordDto = {
      currentPassword: 'oldPassword123!',
      password: 'newPassword123!',
      confirmPassword: 'newPassword123!',
    };
    await controller.changePassword(dto, mockUser);
    expect(service.changePassword).toHaveBeenCalledWith(dto, mockUser);
  });

  it('should update user profile', async () => {
    const dto: UpdateProfileDto = {
      firstname: 'NewFirst',
      lastname: 'NewLast',
      age: 28,
      phone: '+19876543210',
      gender: Gender.FEMALE,
      location: {
        latitude: 12.34,
        longitude: 56.78,
      },
      preferences: {
        interestedIn: ['Male'],
        ageRange: {
          min: 20,
          max: 40,
        },
        distance: 30,
      },
    };

    await controller.updateProfile(dto, mockUser);
    expect(service.updateProfile).toHaveBeenCalledWith(dto, mockUser);
  });

  it('should update user profile image', async () => {
    const file = { originalname: 'avatar.png' } as Express.Multer.File;
    await controller.updateProfileImage(file, mockUser);
    expect(service.updateProfileImage).toHaveBeenCalledWith(file, mockUser);
  });

  it('should update profile visibility', async () => {
    const dto: UpdateProfileVisibilityDto = {
      profilevisibility: ProfileVisibility.PRIVATE,
    };
    await controller.profileVisibility(dto, mockUser);
    expect(service.profileVisibility).toHaveBeenCalledWith(dto, mockUser);
  });

  it('should update user plan', async () => {
    const dto: UpdatePlan = {
      userplan: UserPlan.PREMIUM,
    };
    await controller.updatePlan(dto, mockUser);
    expect(service.updatePlan).toHaveBeenCalledWith(dto, mockUser);
  });

  it('should get user profile by id', async () => {
    const id = 'some-user-id';
    await controller.getUserProfileById(id);
    expect(service.getUserProfileById).toHaveBeenCalledWith({ id });
  });
});

