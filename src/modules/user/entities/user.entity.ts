import { EntityName } from 'src/enums/entity-name.enum';
import { Roles } from 'src/enums/role.enum';
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity(EntityName.USER)
export class UserEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ length: 100, nullable: true })
  full_name: string;

  @Column({ length: 100, unique: true })
  email: string;

  @Column({ length: 100, nullable: false })
  password: string;

  @Column({ default: true })
  is_active: boolean;

  @Column({ default: Roles.USER })
  role: Roles;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
