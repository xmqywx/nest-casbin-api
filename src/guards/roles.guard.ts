import {
    CanActivate,
    ExecutionContext,
    Injectable,
    Inject,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Enforcer } from 'casbin';
import { UserEntity } from '../modules/user/user.entity';
@Injectable()
export class RolesGuard implements CanActivate {
    constructor(
        private readonly _reflector: Reflector,
        @Inject('CASBIN_ENFORCER') private readonly _enforcer: Enforcer,
    ) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        let isAuth = false;
        const user = <UserEntity>request.user;
        await this._enforcer.addPolicy(
            user.id,
            'domain',
            request.path,
            request.method,
        );
        isAuth = await this._enforcer.enforce(
            user.id,
            'domain',
            request.path,
            request.method,
        );
        return isAuth;
    }
}
