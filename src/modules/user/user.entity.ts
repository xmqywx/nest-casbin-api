import { Column, Entity } from 'typeorm';

import { AbstractEntity } from '../../common/abstract.entity';
import { RoleType } from '../../common/constants/role-type';
import { UserDto } from './dto/UserDto';
import { PasswordTransformer } from './password.transformer';

@Entity({ name: 'users' })
export class UserEntity extends AbstractEntity<UserDto> {
    @Column({ type: 'varchar', length: 20, nullable: false })
    firstName: string;

    @Column({ type: 'varchar', length: 20, nullable: false })
    lastName: string;

    @Column({ type: 'varchar', default: RoleType.USER })
    role: RoleType;

    @Column({ unique: true, nullable: true })
    email: string;

    @Column({ nullable: true, transformer: new PasswordTransformer() })
    password: string;

    @Column({ type: 'varchar', nullable: true })
    phone: string;

    @Column({ nullable: true })
    avatar: string;

    dtoClass = UserDto;
}
