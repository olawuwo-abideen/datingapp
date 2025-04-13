import { Test, TestingModule } from '@nestjs/testing';
import { AdminController } from './admin.controller';
import { AdminService } from '../services/admin.service';
import { PaginationDto } from '../../../shared-module/dtos/pagination.dto';
import { UpdateUserStatusDto } from '../dto/updateuserstatus.dto';
import { UserStatus } from '../../../shared-module/entities/user.entity';

describe('AdminController', () => {
  let controller: AdminController;
  let adminService: AdminService;

  const mockAdminService = {
    getAllUsers: jest.fn(),
    deleteUser: jest.fn(),
    getAllReports: jest.fn(),
    updateUserStatus: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AdminController],
      providers: [
        {
          provide: AdminService,
          useValue: mockAdminService,
        },
      ],
    }).compile();

    controller = module.get<AdminController>(AdminController);
    adminService = module.get<AdminService>(AdminService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should get all users', async () => {
    const pagination: PaginationDto = { page: 1, pageSize: 10 };
    const expectedResult = [{ id: '1', name: 'John Doe' }];

    mockAdminService.getAllUsers.mockResolvedValue(expectedResult);

    const result = await controller.getAllUsers(pagination);
    expect(result).toEqual(expectedResult);
    expect(adminService.getAllUsers).toHaveBeenCalledWith(pagination);
  });

  it('should delete a user by ID', async () => {
    const userId = '123e4567-e89b-12d3-a456-426614174000';
    const expectedResult = { message: 'User deleted successfully' };

    mockAdminService.deleteUser.mockResolvedValue(expectedResult);

    const result = await controller.deleteUser(userId);
    expect(result).toEqual(expectedResult);
    expect(adminService.deleteUser).toHaveBeenCalledWith({ id: userId });
  });

  it('should get all reports', async () => {
    const expectedResult = [{ reportId: 'r1' }];

    mockAdminService.getAllReports.mockResolvedValue(expectedResult);

    const result = await controller.getAllReports();
    expect(result).toEqual(expectedResult);
    expect(adminService.getAllReports).toHaveBeenCalled();
  });

  it('should update user status', async () => {
    const userId = '123e4567-e89b-12d3-a456-426614174000';
    const dto: UpdateUserStatusDto = { userstatus: UserStatus.ACTIVE };
    const expectedResult = { id: userId, userstatus: UserStatus.ACTIVE };

    mockAdminService.updateUserStatus.mockResolvedValue(expectedResult);

    const result = await controller.updateUserStatus(userId, dto);
    expect(result).toEqual(expectedResult);
    expect(adminService.updateUserStatus).toHaveBeenCalledWith(userId, dto);
  });
});
