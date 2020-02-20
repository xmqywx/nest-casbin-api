import './boilerplate.polyfill';

import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { contextMiddleware } from './middlewares';
import { AuthModule } from './modules/auth/auth.module';
import { MathModule } from './modules/math/math.module';
import { UserModule } from './modules/user/user.module';
import { CasbinModule } from './modules/casbin/casbin.module';

import { ConfigService } from './shared/services/config.service';
import { SharedModule } from './shared/shared.module';
import { join } from 'path';
@Module({
    imports: [
        AuthModule,
        UserModule,
        MathModule,
        CasbinModule.forRootAsync(() => {
            const configService = new ConfigService();
            return configService.typeOrmAdp;
        }, join(__dirname, '../ormconfig/casbin_model.conf')),
        TypeOrmModule.forRootAsync({
            imports: [SharedModule],
            useFactory: (configService: ConfigService) =>
                configService.typeOrmConfig,
            inject: [ConfigService],
        }),
    ],
})
export class AppModule implements NestModule {
    configure(consumer: MiddlewareConsumer): MiddlewareConsumer | void {
        consumer.apply(contextMiddleware).forRoutes('*');
    }
}
