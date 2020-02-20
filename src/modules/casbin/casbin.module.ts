import { DynamicModule, Module, Provider, Global } from '@nestjs/common';
import { Adapter, newEnforcer } from 'casbin';
import TypeORMAdapter from 'typeorm-adapter';
import { CasbinService } from './casbin.service';
import { CASBIN_ENFORCER } from './casbin.constants';
@Global()
@Module({})
export class CasbinModule {
    public static forRootAsync(
        getConfig,
        casbinModelPath: string,
    ): DynamicModule {
        const config = getConfig();
        const casbinEnforcerProvider: Provider = {
            provide: CASBIN_ENFORCER,
            useFactory: async () => {
                const adapter = await TypeORMAdapter.newAdapter(config);
                const enforcer = await newEnforcer(casbinModelPath, adapter);
                enforcer.initWithAdapter(
                    casbinModelPath,
                    <Adapter>(<any>adapter),
                );
                return enforcer;
            },
        };
        return {
            exports: [casbinEnforcerProvider, CasbinService],
            module: CasbinModule,
            providers: [casbinEnforcerProvider, CasbinService],
        };
    }
}
