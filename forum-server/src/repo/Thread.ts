import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
} from "typeorm";
import { Length } from "class-validator";
import { User } from "./User";
import { ThreadItem } from "./ThreadItem";
import { ThreadPoint } from "./ThreadPoint";
import { ThreadCategory } from "./ThreadCategory";

@Entity({ name: "Threads" })
export class Thread {
  @PrimaryGeneratedColumn({ name: "Id", type: "bigint" })
  id: string;

  @Column("int", {
    name: "Views",
    default: 0,
    nullable: false,
  })
  views: number;

  @Column("boolean", {
    name: "IsDisabled",
    default: false,
    nullable: false,
  })
  isDisabled: boolean;

  @Column("varchar", {
    name: "Title",
    length: 150,
    nullable: false,
  })
  @Length(5, 150)
  title: string;

  @Column("varchar", {
    name: "Body",
    length: 2500,
    nullable: true,
  })
  @Length(10, 2500)
  body: string;

  @OneToMany(() => ThreadItem, (threadItems) => threadItems.thread)
  threadItems: ThreadItem[];

  @ManyToOne(() => User, (user: User) => user.threads)
  user: User;

  @OneToMany(() => ThreadPoint, (threadPoint) => threadPoint.thread)
  threadPoints: ThreadPoint[];

  @ManyToOne(() => ThreadCategory, (threadCategory) => threadCategory.threads)
  category: ThreadCategory;
}
