// import { Test, TestingModule } from '@nestjs/testing';
// import { AdminService } from './admin.service';

// describe('AdminService', () => {
//   let service: AdminService;

//   beforeEach(async () => {
//     const module: TestingModule = await Test.createTestingModule({
//       providers: [AdminService],
//     }).compile();

//     service = module.get<AdminService>(AdminService);
//   });

//   it('should be defined', () => {
//     expect(service).toBeDefined();
//   });
// });




import { Test, TestingModule } from '@nestjs/testing';
import { AdminService } from './admin.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User, UserStatus } from '../../../shared-module/entities/user.entity';
import { Report } from '../../../shared-module/entities/report.entity';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';
import { PaginationDto } from '../../../shared-module/dtos/pagination.dto';
import { UpdateUserStatusDto } from '../dto/updateuserstatus.dto';

describe('AdminService', () => {
  let service: AdminService;
  let userRepository: Repository<User>;
  let reportRepository: Repository<Report>;

  const mockUserRepo = {
    findAndCount: jest.fn(),
    findOne: jest.fn(),
    delete: jest.fn(),
    save: jest.fn(),
  };

  const mockReportRepo = {
    find: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AdminService,
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepo,
        },
        {
          provide: getRepositoryToken(Report),
          useValue: mockReportRepo,
        },
      ],
    }).compile();

    service = module.get<AdminService>(AdminService);
    userRepository = module.get(getRepositoryToken(User));
    reportRepository = module.get(getRepositoryToken(Report));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getAllUsers', () => {
    it('should return paginated users', async () => {
      const pagination: PaginationDto = { page: 1, pageSize: 2 };
      const users = [{ id: '1' }, { id: '2' }];
      mockUserRepo.findAndCount.mockResolvedValue([users, 10]);

      const result = await service.getAllUsers(pagination);

      expect(result.data).toEqual(users);
      expect(result.totalItems).toBe(10);
      expect(mockUserRepo.findAndCount).toHaveBeenCalledWith({
        skip: 0,
        take: 2,
      });
    });
  });

  describe('deleteUser', () => {
    it('should delete a user successfully', async () => {
      const user = { id: '123' } as User;
      mockUserRepo.findOne.mockResolvedValue(user);
      mockUserRepo.delete.mockResolvedValue({});

      const result = await service.deleteUser({ id: '123' });

      expect(result.message).toContain('123');
      expect(mockUserRepo.findOne).toHaveBeenCalledWith({ where: { id: '123' } });
      expect(mockUserRepo.delete).toHaveBeenCalledWith('123');
    });

    it('should throw NotFoundException if user does not exist', async () => {
      mockUserRepo.findOne.mockResolvedValue(null);

      await expect(service.deleteUser({ id: 'not-found' })).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('getAllReports', () => {
    it('should return formatted reports', async () => {
      const reports = [
        { id: '1', reason: 'Spam', details: 'Fake profile', reportId: 'U1', userId: 'U2' },
      ];
      mockReportRepo.find.mockResolvedValue(reports);

      const result = await service.getAllReports();

      expect(result.message).toBe('Reports retrieved successfully');
      expect(result.data[0].reportId).toBe('1');
      expect(result.data[0].reason).toBe('Spam');
    });
  });

  describe('updateUserStatus', () => {
    it('should update user status', async () => {
      const user = { id: '123', userstatus: UserStatus.ACTIVE } as User;
      const dto: UpdateUserStatusDto = { userstatus: UserStatus.ACTIVE };
      mockUserRepo.findOne.mockResolvedValue(user);
      mockUserRepo.save.mockResolvedValue({ ...user, userstatus: dto.userstatus });

      const result = await service.updateUserStatus('123', dto);

      expect(result.message).toContain('active');
      expect(mockUserRepo.findOne).toHaveBeenCalledWith({ where: { id: '123' } });
      expect(mockUserRepo.save).toHaveBeenCalledWith({ ...user, userstatus: dto.userstatus });
    });

    it('should throw NotFoundException if user not found', async () => {
      mockUserRepo.findOne.mockResolvedValue(null);
      const dto: UpdateUserStatusDto = { userstatus: UserStatus.ACTIVE };

      await expect(service.updateUserStatus('404', dto)).rejects.toThrow(NotFoundException);
    });
  });
});
