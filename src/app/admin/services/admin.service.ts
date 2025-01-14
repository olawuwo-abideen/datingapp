import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/shared-module/entities/user.entity';
import { Repository } from 'typeorm';
import { Report } from 'src/shared-module/entities/report.entity';
import { UpdateUserStatusDto } from '../dto/updateuserstatus.dto';

@Injectable()
export class AdminService {
constructor(
@InjectRepository(User) private readonly userRepository: Repository<User>,
@InjectRepository(Report) private readonly reportRepository: Repository<Report>
){}

public async getAllUsers(): Promise<User[]> {
return await this.userRepository.find();
}

public async deleteUser(params: { id: string }): Promise<{ message: string }> {
const { id } = params;


const user = await this.userRepository.findOne({ where: { id } });

if (!user) {
throw new NotFoundException(`User with ID ${id} not found.`);
}
await this.userRepository.delete(id);

return { message: `User with ID ${id} has been successfully deleted.` };
}


public async getAllReports(): Promise<any> {
const reports = await this.reportRepository.find({
});

const transformedReports = reports.map((report) => ({
reportId: report.id,
reason: report.reason,
details: report.details,
reportedUserId: report.reportId,
userCreatingTheReport: report.userId,
}));


return {
data: transformedReports,
};
}



public async updateUserStatus(
  userId: string,
  updateUserStatusDto: UpdateUserStatusDto,
): Promise<{ message: string }> {
  const { userstatus } = updateUserStatusDto;


  const user = await this.userRepository.findOne({ where: { id: userId } });

  if (!user) {
    throw new NotFoundException(`User with ID ${userId} not found.`);
  }
  user.userstatus = userstatus;
  await this.userRepository.save(user);

  return { message: `User status updated to '${userstatus}' for user with ID ${userId}.` };
}



}
