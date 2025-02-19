import { Body, Controller, Delete, Get, HttpStatus, Param, Patch, Post, Query } from '@nestjs/common';
import { AdminService } from '../services/admin.service';
import { IsValidUUIDPipe } from '../../../shared-module/pipes/is-valid-uuid.pipe';
import { UpdateUserStatusDto } from '../dto/updateuserstatus.dto';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { User } from '../../../shared-module/entities/user.entity';
import { PaginationDto } from '../../../shared-module/dtos/pagination.dto';

@ApiBearerAuth()
@ApiTags('Admin')
@Controller('admin')
export class AdminController {

constructor(private readonly adminService: AdminService){}

@Get('/users')
@ApiOperation({ summary: 'Get all users' })
@ApiResponse({
  status: HttpStatus.OK,
  description: 'Retrieved all users successfully.',
})
public async getAllUsers(@Query() paginationData: PaginationDto,) {
return await this.adminService.getAllUsers(paginationData);
}


@Delete('user/:id')
@ApiOperation({ summary: 'Delete a user' })
@ApiResponse({
  status: HttpStatus.OK,
  description: 'Delete a user successfully.',
  type: [User],
})
public async deleteUser(
@Param('id', IsValidUUIDPipe) id: string,
)  {    
return await this.adminService.deleteUser({ id });
}

@Get('/reports')
@ApiOperation({ summary: 'Get all reports' })
@ApiResponse({
  status: HttpStatus.OK,
  description: 'Retrieved all reports.',
  type: [User],
})
public async getAllReports() {
return await this.adminService.getAllReports();
}


@Patch('user/status/:id')
@ApiOperation({ summary: 'Update user status' })
@ApiResponse({
  status: HttpStatus.OK,
  description: 'Update user status',
  type: [User],
})
  public async updateUserStatus(
    @Param('id', IsValidUUIDPipe) id: string,
    @Body() updateUserStatusDto: UpdateUserStatusDto,
  ) {
    return await this.adminService.updateUserStatus(id, updateUserStatusDto);
  }


}
