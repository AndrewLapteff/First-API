import { RequestExtended } from '@app/types/requestExtended.interface'
import { createParamDecorator, ExecutionContext } from '@nestjs/common'
export const User = createParamDecorator((param: any, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest<RequestExtended>()
  if (request == null)
    return null

  if (param)
    return request.user[ param ]

  return request.user
})