import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';
import { UserService } from '../services/user.service';
import { Injectable } from '@nestjs/common';

@ValidatorConstraint({ async: true })
@Injectable()
export class UserAlreadyExistConstraint
  implements ValidatorConstraintInterface
{
  constructor(private readonly userService: UserService) {}

  async validate(value: string, args: ValidationArguments): Promise<boolean> {
    const user = await this.userService.exists({
      email: value,
    });

    // if (args.user)

    return !user;
  }

  defaultMessage(validationArguments?: ValidationArguments): string {
    return `User already exists in our records`;
  }
}

export function UserAlreadyExist(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: UserAlreadyExistConstraint,
    });
  };
}
