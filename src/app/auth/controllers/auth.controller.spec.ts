import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from '../services/auth.service';
import { SignupDto } from '../dto/signup.dto';
import { LoginDto } from '../dto/login.dto';
import { ForgotPasswordDto, ResetPasswordDto } from '../dto/reset-password.dto';
import { UserRole } from '../../../shared-module/entities/user.entity';

describe('AuthController', () => {
  let authController: AuthController;
  let authService: AuthService;

  const mockAuthService = {
    signup: jest.fn(),
    login: jest.fn(),
    forgotPassword: jest.fn(),
    resetPassword: jest.fn(),
  };

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
      ],
    }).compile();

    authController = moduleRef.get<AuthController>(AuthController);
    authService = moduleRef.get<AuthService>(AuthService);
  });

  afterEach(() => jest.clearAllMocks());

  describe('signup', () => {
    it('should call authService.signup and return the result', async () => {
      const dto: SignupDto = {
        firstname: 'John',
        lastname: 'Doe',
        email: 'john@example.com',
        role: UserRole.USER,
        phone: '08012345678',
        password: 'Password123!',
        confirmPassword: 'Password123!',
      };
      const result = { message: 'User created' };

      mockAuthService.signup.mockResolvedValue(result);

      const response = await authController.signup(dto);

      expect(mockAuthService.signup).toHaveBeenCalledWith(dto);
      expect(response).toEqual(result);
    });
  });

  describe('login', () => {
    it('should call authService.login and return the token', async () => {
      const dto: LoginDto = {
        email: 'john@example.com',
        password: 'Password123!',
      };
      const token = { access_token: 'jwt.token.here' };

      mockAuthService.login.mockResolvedValue(token);

      const result = await authController.login(dto);

      expect(mockAuthService.login).toHaveBeenCalledWith(dto);
      expect(result).toEqual(token);
    });
  });

  describe('forgotPassword', () => {
    it('should call authService.forgotPassword with email', async () => {
      const dto: ForgotPasswordDto = {
        email: 'john@example.com',
      };
      const result = { message: 'Reset link sent' };

      mockAuthService.forgotPassword.mockResolvedValue(result);

      const response = await authController.forgotPassword(dto);

      expect(mockAuthService.forgotPassword).toHaveBeenCalledWith(dto.email);
      expect(response).toEqual(result);
    });
  });

  describe('resetPassword', () => {
    it('should call authService.resetPassword with payload', async () => {
      const dto: ResetPasswordDto = {
        password: 'NewPassword123!',
        confirmPassword: 'NewPassword123!',
        token: 'securetoken123',
      };

      mockAuthService.resetPassword.mockResolvedValue(undefined);

      const result = await authController.resetPassword(dto);

      expect(mockAuthService.resetPassword).toHaveBeenCalledWith(dto);
      expect(result).toBeUndefined();
    });
  });
});
