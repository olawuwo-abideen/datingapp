import {
  ArgumentMetadata,
  BadRequestException,
<<<<<<< HEAD
  Injectable
=======
  Injectable,
  PipeTransform,
>>>>>>> 21981fb5e1637d1fdf4cb3b2647d25c71f258d22
} from '@nestjs/common';
import { ParseUUIDPipe } from '@nestjs/common';

@Injectable()
export class IsValidUUIDPipe extends ParseUUIDPipe {
  constructor() {
    super({ errorHttpStatusCode: 400 });
  }

  async transform(value: any, metadata: ArgumentMetadata): Promise<string> {
    try {
      return await super.transform(value, metadata);
    } catch (error) {
      // Custom error message
      throw new BadRequestException(
        'Invalid UUID format. Please provide a valid UUID.',
      );
    }
  }
}
