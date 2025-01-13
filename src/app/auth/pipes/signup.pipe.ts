import {
  ArgumentMetadata,
  Injectable,
  BadRequestException,
  PipeTransform,
} from '@nestjs/common';
import { SignupDto } from '../dto/sigup.dto';
import { UserService } from '../../user/user.service';
import { VerificationService } from '../../../shared-module/services/verification/verification.service';

@Injectable()
export class SignupPipe implements PipeTransform {
  constructor(
    private readonly verificationService: VerificationService,
    private readonly userService: UserService,
  ) {}

  async transform(data: SignupDto, _metadata: ArgumentMetadata) {
    const errors: string[] = [];

    // validate password
    this.validatePassword(data);

    // if (errors.length) {
    //   throw new BadRequestException(errors.join('\n'));
    // }

    return data;
  }

  private validatePassword(data: SignupDto): void {
    // check if confirm password is same as password
    if (data.password !== data.confirmPassword) {
      throw new BadRequestException(
        'Password does not match with confirm password',
      );
    }
  }
}
