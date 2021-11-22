import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { User } from "./user.entity";

export const GetUser = createParamDecorator((data, ctx: ExecutionContext): User => {
  
    
    const req = ctx.switchToHttp().getRequest();
   // console.log(req);
    //console.log(req?.username);
    return req.user;
});
