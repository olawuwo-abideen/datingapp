import {
  Controller,
  Get,
  Request,
  Body,
  Post,
  Put,
  UseInterceptors,
  UploadedFile,
  Param,
  HttpStatus
} from '@nestjs/common';
import RequestWithUser from '../../../shared-module/dtos/request-with-user.dto';
import { UserService } from '../services/user.service';
import { CurrentUser } from '../../../shared-module/decorators/current-user.decorator';
import { User } from '../../../shared-module/entities/user.entity';
import { ChangePasswordDto } from '../dto/change-password.dto';
import {UpdateProfileDto, UpdateProfileVisibilityDto } from '../dto/update-profile.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { IsValidUUIDPipe } from '../../../shared-module/pipes/is-valid-uuid.pipe';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiBearerAuth()
@ApiTags('User')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('')
    @ApiOperation({ summary: 'Get current user profile' })
    @ApiResponse({ 
      status: HttpStatus.OK,
      description:
        'User profile retrieve successfully.',
    })
  async getProfile(@Request() req: RequestWithUser) {
    return await this.userService.profile(req.user);
  }

  @Post('change-password')
    @ApiOperation({ summary: 'User change password' })
    @ApiBody({ type: ChangePasswordDto, description: 'Change user password' })
    @ApiResponse({
      status: HttpStatus.OK,
      description:
        'User Password updated successfully',
    })
  public async changePassword(
    @Body() payload: ChangePasswordDto,
    @CurrentUser() user: User,
  ) {
    return await this.userService.changePassword(payload, user);
  }

  @Put('')
    @ApiOperation({ summary: 'Update user profile' })
    @ApiBody({ type: UpdateProfileDto, description: 'Update user profile' })
    @ApiResponse({
      status: HttpStatus.OK,
      description:
        'User profile updated successfully',
    })
  public async updateProfile(
    @Body() payload: UpdateProfileDto,
    @CurrentUser() user: User,
  ) {
    return await this.userService.updateProfile(payload, user);
  }



  @Put('profile-image')
    @ApiOperation({ summary: 'User Update profile image ' })
    @ApiBody({description: 'User update profile image' })
    @ApiResponse({
      status: HttpStatus.OK,
      description:
        'Image update successfully.',
    })
  @UseInterceptors(FileInterceptor('profileimage'))
  public async updateProfileImage(
    @UploadedFile() profileimage: Express.Multer.File,
    @CurrentUser() user: User,
  ) {
    return await this.userService.updateProfileImage(profileimage, user);
  }

  @Put('profile/visibility')
    @ApiOperation({ summary: 'Update profile visibility' })
    @ApiBody({ type: UpdateProfileVisibilityDto, description: 'Update profile visibility' })
    @ApiResponse({
      status: HttpStatus.CREATED,
      description:
        'User profile updated successfully.',
    })
  public async profileVisibility(
    @Body() payload: UpdateProfileVisibilityDto,
    @CurrentUser() user: User,
  ) {
    return await this.userService.profileVisibility(payload, user);
  }


  @Get(':id')
    @ApiOperation({ summary: 'Get user profile by id' })
    @ApiResponse({
      status: HttpStatus.OK,
      description:
        'User profile retrieve successfully.',
    })
  public async getUserProfileById(
    @Param('id', IsValidUUIDPipe) id: string,
  ): Promise<{ user: User }> {    
    return await this.userService.getUserProfileById({ id });
  }



}
