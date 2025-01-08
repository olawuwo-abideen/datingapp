import { Controller, Delete, Get, Param } from '@nestjs/common';
import { User } from 'src/shared-module/entities/user.entity';
import { CurrentUser } from 'src/shared-module/decorators/current-user.decorator'; 
import { AdminService } from '../services/admin.service';
import { IsValidUUIDPipe } from 'src/shared-module/pipes/is-valid-uuid.pipe';

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







}
