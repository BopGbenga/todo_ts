import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BeforeInsert,
  OneToMany,
} from "typeorm";
import bcrypt from "bcrypt";
import Todo from "./todo";

@Entity({
  name: "users",
})
export default class user {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  fullname!: string;

  @Column({ unique: true })
  username!: string;
  @Column({
    unique: true,
    nullable: false,
    type: "varchar",
  })
  email!: string;

  @Column()
  password!: string;

  @OneToMany(() => Todo, (todo) => todo.user)
  todos!: Todo[];

  @BeforeInsert()
  async hashPassword(): Promise<void> {
    const hashedPassword = await bcrypt.hash(this.password, 10);
    this.password = hashedPassword;
  }
  async isMatch(password: string): Promise<boolean> {
    return await bcrypt.compare(password, this.password);
  }
}
