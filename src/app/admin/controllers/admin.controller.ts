import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { AdminService } from '../services/admin.service';
import { IsValidUUIDPipe } from 'src/shared-module/pipes/is-valid-uuid.pipe';
import { UpdateUserStatusDto } from '../dto/updateuserstatus.dto';

@Controller('admin')
export class AdminController {

constructor(private readonly adminService: AdminService){}

@Get('/users')
public async getAllUsers() {
return await this.adminService.getAllUsers();
}

@Delete('user/:id')
public async deleteUser(
@Param('id', IsValidUUIDPipe) id: string,
)  {    
return await this.adminService.deleteUser({ id });
}

@Get('/reports')
public async getAllReports() {
return await this.adminService.getAllReports();
}


@Patch('user/status/:id')
  public async updateUserStatus(
    @Param('id', IsValidUUIDPipe) id: string,
    @Body() updateUserStatusDto: UpdateUserStatusDto,
  ) {
    return await this.adminService.updateUserStatus(id, updateUserStatusDto);
  }


}
