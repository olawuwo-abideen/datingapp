import { IsNotEmpty, MinLength, MaxLength, Matches } from 'class-validator';
<<<<<<< HEAD
import { PasswordMatch } from '../../../shared-module/validations/password-match.validation';
=======
import { PasswordMatch } from '../../../shared-module/validation/password-validation.dto';
>>>>>>> 21981fb5e1637d1fdf4cb3b2647d25c71f258d22

export class ChangePasswordDto {
  @IsNotEmpty({ message: 'Current password is required' })
  currentPassword: string;

  @IsNotEmpty({ message: 'New password is required' })
  @MinLength(6, { message: 'Password must be at least 6 characters long' })
  @MaxLength(20, { message: 'Password must not exceed 20 characters' })
  @Matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[~`|•√π×£¢€¥^={}%✓\]<@#$_&\-+()/?!;:'"*.,])[A-Za-z\d~`|•√π×£¢€¥^={}%✓\]<@#$_&\-+()/?!;:'"*.,]+$/,
    {
      message:
        'Password must contain at least one uppercase letter, one lowercase letter, and one number',
    },
  )
  password: string;

  @IsNotEmpty({ message: 'Confirm password is required' })
  @PasswordMatch()
  confirmPassword: string;
}
