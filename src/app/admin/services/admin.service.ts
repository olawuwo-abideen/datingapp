import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/shared-module/entities/user.entity';
import { FindOptionsWhere, Repository, UpdateResult } from 'typeorm';


@Injectable()
export class AdminService {
    constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>
){}

public async getAllUsers(): Promise<User[]> {
    return await this.userRepository.find();
  }

public async deleteUser(params: { id: string }): Promise<{ message: string }> {
    const { id } = params;

    // Fetch the user to ensure they exist
    const user = await this.userRepository.findOne({ where: { id } });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found.`);
    }
    await this.userRepository.delete(id);

    return { message: `User with ID ${id} has been successfully deleted.` };
  }


  






}
