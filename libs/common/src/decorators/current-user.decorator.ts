import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { UserDocument } from '../../../../apps/auth/src/users/models/user.schema';

const getCurrentUserByContext = (context: ExecutionContext): UserDocument => {
  return context.switchToHttp().getRequest<Request & { user: UserDocument }>()
    .user;
};

export const CurrentUser = createParamDecorator(
  (_data: unknown, context: ExecutionContext) =>
    getCurrentUserByContext(context),
);
