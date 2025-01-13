import {
<<<<<<< HEAD
  IsEmail,
  IsMobilePhone,
  IsNotEmpty,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

export class LoginDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @MinLength(6)
  @MaxLength(20)
  @Matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[~`|•√π×£¢€¥^={}%✓\]<@#$_&\-+()/?!;:'"*.,])[A-Za-z\d~`|•√π×£¢€¥^={}%✓\]<@#$_&\-+()/?!;:'"*.,]+$/,
    {
      message:
        'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character.',
    },
  )
  password: string;
}
=======
    IsEmail,
    IsNotEmpty,
    Matches,
    MaxLength,
    MinLength,
  } from 'class-validator';
  
  export class LoginDto {
    @IsNotEmpty()
    @IsEmail()
    email: string;
  
    @IsNotEmpty()
    @MinLength(6)
    @MaxLength(20)
    @Matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[~`|•√π×£¢€¥^={}%✓\]<@#$_&\-+()/?!;:'"*.,])[A-Za-z\d~`|•√π×£¢€¥^={}%✓\]<@#$_&\-+()/?!;:'"*.,]+$/,
      {
        message:
          'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character.',
      },
    )
    password: string;
  }
  



  
>>>>>>> 21981fb5e1637d1fdf4cb3b2647d25c71f258d22
