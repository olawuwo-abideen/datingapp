import { Test, TestingModule } from '@nestjs/testing';
import { ReportController } from './report.controller';
import { ReportService } from '../services/report.service';
import { ReportDto } from '../dto/report.dto';
import { User } from '../../../shared-module/entities/user.entity';
import { UserStatus } from '../../../shared-module/entities/user.entity';

const mockReportService = {
  reportUser: jest.fn(),
  getUserReports: jest.fn(),
  blockUser: jest.fn(),
  unblockUser: jest.fn(),
  getBlockedUsers: jest.fn(),
};

function createMockUser(overrides: Partial<User> = {}): User {
  return {
    id: 'user-123',
    email: 'mock@example.com',
    phone: '1234567890',
    userstatus: UserStatus.ACTIVE,
    profilevisibility: 'PUBLIC',
    preferences: {
      interestedIn: ['sports'],
      ageRange: { min: 20, max: 30 },
      distance: 10,
    },
    location: { latitude: 0, longitude: 0 },
    createdAt: new Date(),
    updatedAt: new Date(),
    ...overrides,
  } as User;
}

describe('ReportController', () => {
  let controller: ReportController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ReportController],
      providers: [
        {
          provide: ReportService,
          useValue: mockReportService,
        },
      ],
    }).compile();

    controller = module.get<ReportController>(ReportController);
  });

  afterEach(() => jest.clearAllMocks());

  describe('reportUser', () => {
    it('should call reportService.reportUser with correct arguments', async () => {
      const user = createMockUser();
      const reportedUserId = 'target-id';
      const reportDto: ReportDto = { reason: 'Harassment', details: 'This user was abusive.' };

      mockReportService.reportUser.mockResolvedValue({ success: true });

      const result = await controller.reportUser(user, reportedUserId, reportDto);

      expect(mockReportService.reportUser).toHaveBeenCalledWith(user, reportedUserId, reportDto);
      expect(result).toEqual({ success: true });
    });
  });

  describe('getUserReports', () => {
    it('should return reports of current user', async () => {
      const user = createMockUser();
      const mockReports = [{ id: 'report1' }, { id: 'report2' }];
      mockReportService.getUserReports.mockResolvedValue(mockReports);

      const result = await controller.getUserReports(user);
      expect(mockReportService.getUserReports).toHaveBeenCalledWith(user.id);
      expect(result).toEqual(mockReports);
    });
  });

  describe('blockUser', () => {
    it('should call reportService.blockUser', async () => {
      const user = createMockUser();
      const userId = 'block-id';
      mockReportService.blockUser.mockResolvedValue({ message: 'User blocked' });

      const result = await controller.blockUser(userId, user);
      expect(mockReportService.blockUser).toHaveBeenCalledWith(user, userId);
      expect(result).toEqual({ message: 'User blocked' });
    });
  });

  describe('unblockUser', () => {
    it('should call reportService.unblockUser', async () => {
      const user = createMockUser();
      const userId = 'unblock-id';
      mockReportService.unblockUser.mockResolvedValue({ message: 'User unblocked' });

      const result = await controller.unblockUser(userId, user);
      expect(mockReportService.unblockUser).toHaveBeenCalledWith(user, userId);
      expect(result).toEqual({ message: 'User unblocked' });
    });
  });

  describe('getBlockedUsers', () => {
    it('should return blocked users', async () => {
      const user = createMockUser();
      const blockedUsers = [{ id: 'u1' }, { id: 'u2' }];
      mockReportService.getBlockedUsers.mockResolvedValue(blockedUsers);

      const result = await controller.getBlockedUsers(user);
      expect(mockReportService.getBlockedUsers).toHaveBeenCalledWith(user);
      expect(result).toEqual(blockedUsers);
    });
  });
});
