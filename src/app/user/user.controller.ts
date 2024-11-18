import {
    Controller,
    Get,
    Request,
    Body,
    Post,
    Put,
    UseInterceptors,
    UploadedFile,
  } from '@nestjs/common';
  import RequestWithUser from '../../shared-module/dtos/request-with-user.dto';
  import { UserService } from './user.service';
  import { CurrentUser } from '../../shared-module/decorators/current-user.decorator';
  import { User } from '../../shared-module/entities/user.entity';
  import { ChangePasswordDto } from './dto/change-password.dto';
  import {UpdateProfileDto } from './dto/update-profile.dto';
  import { FileInterceptor } from '@nestjs/platform-express';


@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Get('')
    async getProfile(@Request() req: RequestWithUser) {
      return await this.userService.profile(req.user);
    }
  
    @Post('change-password')
    public async changePassword(
      @Body() payload: ChangePasswordDto,
      @CurrentUser() user: User,
    ) {
      return await this.userService.changePassword(payload, user);
    }


  @Put('')
  public async updateProfile(
    @Body() payload: UpdateProfileDto,
    @CurrentUser() user: User,
  ) {
    return await this.userService.updateProfile(payload, user);
  }
  
    @Put('profile-image')
    @UseInterceptors(FileInterceptor('profileimage'))
    public async updateProfileImage(
      @UploadedFile() profileImage: Express.Multer.File,
      @CurrentUser() user: User,
    ) {
      return await this.userService.updateProfileImage(profileImage, user);
    }
  
}



