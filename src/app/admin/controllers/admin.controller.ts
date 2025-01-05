import { Controller, Delete } from '@nestjs/common';
import { User } from 'src/shared-module/entities/user.entity';
import { CurrentUser } from 'src/shared-module/decorators/current-user.decorator'; 
import { AdminService } from '../services/admin.service';

@Controller('admin')
export class AdminController {

    constructor(private readonly adminService: AdminService){}


    @Delete('')
    public async deleteUser(@CurrentUser() user: User) {
      return await this.adminService.deleteUser({ id: user.id });
}
}
