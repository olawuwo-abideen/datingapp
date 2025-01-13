import {
    IsEmail,
    IsEnum,
    IsMobilePhone,
    IsNotEmpty,
    IsString,
    Matches,
    MaxLength,
    MinLength,
  } from 'class-validator';
  import { PasswordMatch } from '../../../shared-module/validation/password-validation.dto';
  import { UserRole } from '../../../shared-module/entities/user.entity';
  
  export class SignupDto {

    @IsNotEmpty()
    @IsString()
    firstname: string

    @IsNotEmpty()
    @IsString()
    lastname: string

    @IsNotEmpty()
    @IsString()
    age: number;
  
    @IsNotEmpty()
    @IsEmail()
    email: string;

    @IsNotEmpty()
    @IsMobilePhone()
    phone: string;
  
    @IsNotEmpty()
    @IsEnum(UserRole)
    role: UserRole;
  
  
    @IsNotEmpty()
    @MinLength(6, { message: 'Password must be at least 6 characters long' })
    @MaxLength(20, { message: 'Password must not exceed 20 characters' })
    @Matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[~`|•√π×£¢€¥^={}%✓\]<@#$_&\-+()/?!;:'"*.,])[A-Za-z\d~`|•√π×£¢€¥^={}%✓\]<@#$_&\-+()/?!;:'"*.,]+$/,
      {
        message:
          'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character.',
      },
    )
    password: string;
  
    @IsNotEmpty({ message: 'Confirm password is required' })
    @PasswordMatch()
    confirmPassword: string;
  
  }
  