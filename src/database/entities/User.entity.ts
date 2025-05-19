import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import Category from "./Category.entity";

@Entity({ name: 'users' })
export class User {
    @PrimaryGeneratedColumn('uuid')
    id: string

    @Column({ name: 'name', nullable: false })
    public name: string

    @Column({ name: 'email', unique: true, nullable: false })
    email: string

    @Column({ name: 'password', nullable: false })
    password: string

    @Column({ name: 'ativo', default: false })
    ativo: boolean

    @OneToMany(() => Category, (category) => category.user)
    categories: Category[]
}