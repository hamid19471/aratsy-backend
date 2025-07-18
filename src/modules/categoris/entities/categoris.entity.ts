import { EntityName } from 'src/enums/entity-name.enum';
import { slugGenerator } from 'src/utils/slug-generator';
import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity(EntityName.CATEGORY)
export class CategorisEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ unique: true })
  title: string;

  @Column({ unique: true })
  slug: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @BeforeInsert()
  @BeforeUpdate()
  generateSlut() {
    if (!this.slug) {
      this.slug = slugGenerator(this.title);
    } else {
      this.slug = slugGenerator(this.slug);
    }
  }
}
