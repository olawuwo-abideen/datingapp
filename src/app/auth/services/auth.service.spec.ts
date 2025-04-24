import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UserService } from '../../user/services/user.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { EmailService } from '../../../shared-module/modules/email/email.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { Gender, ProfileVisibility, User, UserPlan, UserRole, UserStatus } from '../../../shared-module/entities/user.entity';
import { SignupDto } from '../dto/signup.dto';
import { LoginDto } from '../dto/login.dto';
import { ConflictException, UnauthorizedException, BadRequestException, NotFoundException } from '@nestjs/common';
import * as bcryptjs from 'bcryptjs';

jest.mock('bcryptjs', () => ({
  hash: jest.fn(),
  compare: jest.fn(),
}));

describe('AuthService', () => {
  let service: AuthService;
  let userRepository: Repository<User>;
  let userService: UserService;
  let jwtService: JwtService;

  const mockUser = {
    id: 'uuid',
    email: 'test@example.com',
    phone: '1234567890',
    password: 'hashedPassword',
    role: UserRole.USER,
    resetToken: null,
    firstname: 'John',
    lastname: 'Doe',
    profilevisibility: ProfileVisibility.PRIVATE,
    userstatus: UserStatus.ACTIVE,
    plan: UserPlan.FREE,
    gender: Gender.MALE,
    location: { latitude: 0, longitude: 0 },
    preferences: {
      interestedIn: ['female'],
      ageRange: { min: 18, max: 30 },
      distance: 50,
    },
    reports: [],
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: null,
    toJSON: jest.fn(),
  } as unknown as User;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UserService,
          useValue: {
            findOne: jest.fn(),
          },
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn().mockReturnValue('token'),
            verify: jest.fn().mockReturnValue({ email: 'test@example.com' }),
          },
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn().mockImplementation((key) => {
              if (key === 'JWT_SECRET') return 'secret';
              if (key === 'JWT_EXPIRATION_TIME') return '3600s';
            }),
          },
        },
        {
          provide: EmailService,
          useValue: {
            sendResetPasswordLink: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(User),
          useValue: {
            findOne: jest.fn(),
            create: jest.fn().mockReturnValue(mockUser),
            save: jest.fn().mockResolvedValue(mockUser),
            update: jest.fn(),
          },
        },
        {
          provide: EntityManager,
          useValue: {
            transaction: jest.fn().mockImplementation(async (cb) => cb({ save: jest.fn().mockResolvedValue(mockUser) })),
          },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));
    userService = module.get<UserService>(UserService);
    jwtService = module.get<JwtService>(JwtService);
  });

  describe('signup', () => {
    it('should throw if email already exists', async () => {
      jest.spyOn(userRepository, 'findOne').mockResolvedValueOnce(mockUser);
      await expect(service.signup({ ...mockUser, confirmPassword: 'hashedPassword' } as SignupDto)).rejects.toThrow(
        ConflictException,
      );
    });

    it('should create a new user if email and phone are unique', async () => {
      jest.spyOn(userRepository, 'findOne').mockResolvedValueOnce(null);
      jest.spyOn(userRepository, 'findOne').mockResolvedValueOnce(null); 
      (bcryptjs.hash as jest.Mock).mockResolvedValue('hashedPassword');

      const result = await service.signup({ ...mockUser, password: '12345678', confirmPassword: '12345678' } as SignupDto);
      expect(result.user).toBeDefined();
      expect(result.message).toBe('User signup successfully');
    });
  });

  describe('login', () => {
    it('should throw if user not found or password incorrect', async () => {
      (userService.findOne as jest.Mock).mockResolvedValue(null);
      await expect(service.login({ email: 'x', password: 'x' })).rejects.toThrow(UnauthorizedException);
    });

    it('should return token and user if credentials are correct', async () => {
      const user = { ...mockUser, password: await bcryptjs.hash('Valid123@', 10) };
      (userService.findOne as jest.Mock).mockResolvedValue(user);
      (bcryptjs.compare as jest.Mock).mockResolvedValue(true);

      const result = await service.login({ email: 'test@example.com', password: 'Valid123@' } as LoginDto);
      expect(result.token).toBeDefined();
      expect(result.message).toBe('User login sucessfully');
    });
  });

  describe('forgotPassword', () => {
    it('should throw if user is not found', async () => {
      (userService.findOne as jest.Mock).mockResolvedValue(null);
      await expect(service.forgotPassword('notfound@example.com')).rejects.toThrow(NotFoundException);
    });

    it('should update user reset token and send email', async () => {
      (userService.findOne as jest.Mock).mockResolvedValue(mockUser);
      const result = await service.forgotPassword(mockUser.email);
      expect(result.message).toBe('Reset token sent to user email');
    });
  });

  describe('decodeConfirmationToken', () => {
    it('should return email if token is valid', async () => {
      const email = await service.decodeConfirmationToken('valid-token');
      expect(email).toBe('test@example.com');
    });

    it('should throw on expired token', async () => {
      jest.spyOn(jwtService, 'verify').mockImplementation(() => {
        throw { name: 'TokenExpiredError' };
      });
      await expect(service.decodeConfirmationToken('expired-token')).rejects.toThrow(BadRequestException);
    });
  });

  describe('resetPassword', () => {
    it('should throw if user not found for token', async () => {
      (userService.findOne as jest.Mock).mockResolvedValue(null);
      await expect(
        service.resetPassword({ token: 'tok', password: '12345678A@', confirmPassword: '12345678A@' }),
      ).rejects.toThrow(BadRequestException);
    });

    it('should reset password for valid token', async () => {
      (userService.findOne as jest.Mock).mockResolvedValue(mockUser);
      (bcryptjs.hash as jest.Mock).mockResolvedValue('newHashedPassword');

      await expect(
        service.resetPassword({ token: 'tok', password: '12345678A@', confirmPassword: '12345678A@' }),
      ).resolves.toBeUndefined();
    });
  });

  describe('createAccessToken', () => {
    it('should return signed JWT token', () => {
      const token = service.createAccessToken(mockUser);
      expect(token).toBe('token');
    });
  });
});
