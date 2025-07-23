import { EntityName } from 'src/enums/entity-name.enum';
import { slugGenerator } from 'src/utils/slug-generator';
import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity(EntityName.BLOG)
export class BlogEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ length: 100 })
  title: string;

  @Column({ length: 100 })
  slug: string;

  @Column()
  content: string;

  @BeforeInsert()
  @BeforeUpdate()
  generateSlug() {
    if (!this.slug) {
      this.slug = slugGenerator(this.title);
    } else {
      this.slug = slugGenerator(this.slug);
    }
  }
}
