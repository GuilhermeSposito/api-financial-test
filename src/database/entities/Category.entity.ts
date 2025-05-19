import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./User.entity";

@Entity({ name: "categories" })
export default class Category {

    @PrimaryGeneratedColumn('uuid')
    id: string

    @Column({ name: "description" })
    description: string

    @ManyToOne(() => User, (user) => user.categories, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'user_id' })
    user: User
}