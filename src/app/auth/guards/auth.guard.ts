import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { IncomingMessage } from 'http';
import { Reflector } from '@nestjs/core';
import { UserService } from '../../user/user.service';
import { User } from '../../../shared-module/entities/user.entity';
import { IS_PUBLIC_KEY } from '../../../shared-module/decorators/public.decorator';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly userService: UserService,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    // Get isPublic decorator
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    // Allow access if isPublic is true
    if (isPublic) {
      return true;
    }

    const request = this.getRequest<IncomingMessage & { user?: User }>(context);
    const url = request.url;

    try {
      // get token
      const token = this.getToken(request);

      // verify token
      const payload = await this.jwtService.verifyAsync(token, {
        secret: this.configService.get<string>('JWT_SECRET'),
      });

      // get user id
      const userId = payload.sub;

      // get user by id
      const user: User | null = await this.userService.findOne({ id: userId });

      // return exception if unable to get user
      if (!user) throw Error();

      user.password = '';

      request.user = user;

      return true;
    } catch (e) {
      throw new UnauthorizedException();
    }
  }
  protected getRequest<T>(context: ExecutionContext): T {
    return context.switchToHttp().getRequest();
  }
  protected getToken(
    request: IncomingMessage & { user?: User | undefined },
  ): string {
    // get auth header
    const authorization = request.headers['authorization'];

    // check if auth header is valid
    if (
      !authorization ||
      authorization.trim() === '' ||
      Array.isArray(authorization)
    ) {
      throw new UnauthorizedException();
    }

    // get token from header
    const [_, token] = authorization.split(' ');
    return token;
  }
}
