import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
// import { Enforcer } from 'casbin';
import { UserEntity } from '../modules/user/user.entity';
import { CasbinService } from '../modules/casbin/casbin.service';
@Injectable()
export class RolesGuard implements CanActivate {
    constructor(
        private readonly _reflector: Reflector,
        private readonly _casbinService: CasbinService,
    ) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        let isAuth = false;
        const user = <UserEntity>request.user;
        // await this._casbinService.addPolicy(
        //     user.id,
        //     'domain',
        //     request.path,
        //     request.method,
        // );
        isAuth = await this._casbinService.checkPermission(
            user.id,
            'domain',
            request.path,
            request.method,
        );
        return isAuth;
    }
}
