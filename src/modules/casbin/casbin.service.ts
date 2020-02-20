import { Inject, Injectable } from '@nestjs/common';
import { Enforcer } from 'casbin';
import { CASBIN_ENFORCER } from './casbin.constants';

Injectable();
export class CasbinService {
    constructor(
        @Inject(CASBIN_ENFORCER) private readonly _enforcer: Enforcer,
    ) {}

    public async reloadPolicy() {
        await this._enforcer.loadPolicy();
    }

    public async addPolicy(...params: string[]) {
        const added = await this._enforcer.addPolicy(...params);
        if (added) {
            await this._enforcer.savePolicy();
        }
    }

    public async removePolicy(...params: string[]) {
        const removed = await this._enforcer.removePolicy(...params);
        if (removed) {
            await this._enforcer.savePolicy();
        }
    }

    public async checkPermission(...params: any[]) {
        return this._enforcer.enforce(...params);
    }
}
