import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { User } from "./User";
import { ThreadItem } from "./ThreadItem";

@Entity({ name: "ThreadItemPoints" })
export class ThreadItemPoint {
  @PrimaryGeneratedColumn({ name: "Id", type: "bigint" })
  id: string;

  @Column("boolean", {
    name: "IsDecrement",
    default: false,
    nullable: false,
  })
  isDecrement: boolean;

  @ManyToOne(() => User, (user) => user.threadPoints)
  user: User;

  @ManyToOne(() => ThreadItem, (threadItem) => threadItem.threadItemPoints)
  threadItem: ThreadItem;
}
