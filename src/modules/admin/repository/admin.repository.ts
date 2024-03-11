import prisma from "../../../config/lib/prisma";
import { CreateAdministratorDTO } from "../dto/create-admin.dto";
import { UpdateAdministratorDTO } from "../dto/update-admin.dto";
export class AdminRepository {
    async create(createAdministratorDTO: CreateAdministratorDTO) {
        return await prisma.administrator.create({ data: createAdministratorDTO });
    }
    async findAll() {
        return await prisma.administrator.findMany({ where: { isActive: true } })
    }
    async findById(Id: number) {
        return await prisma.administrator.findFirstOrThrow({ where: { id: Id } })
    }
    async findByEmail(email: string) {
        return await prisma.administrator.findFirstOrThrow({ where: { email: email } })
    }
    async findPhone(phone: string) {
        return await prisma.administrator.findFirstOrThrow({ where: { phone: phone } })
    }
    async update(Id: number, data: UpdateAdministratorDTO) {
        return await prisma.administrator.update({ where: { id: Id }, data })
    }
    async delete(Id: number) {
        return await prisma.administrator.delete({ where: { id: Id } })
    }
    async activateAccount(Id: number) {
        return await prisma.administrator.update({ where: { id: Id }, data: { isActive: true } })
    }
    async deactivateAccount(Id: number) {
        return await prisma.administrator.update({ where: { id: Id }, data: { isActive: false } })
    }
}