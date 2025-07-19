import { EntityName } from 'src/enums/entity-name.enum';
import { Roles } from 'src/enums/role.enum';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { UserEntity } from './user.entity';

@Entity(EntityName.PROFILE)
export class ProfileEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column()
  full_name: string;

  @Column()
  email: string;

  @Column({ nullable: true })
  mobile: string;

  @Column({ nullable: true })
  avatar: string;

  @Column({ nullable: true, default: Roles.USER })
  role: Roles;

  @Column()
  userId: number;

  @OneToOne(() => UserEntity, (user) => user.profile, {
    onDelete: 'CASCADE',
  })
  user: UserEntity;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
