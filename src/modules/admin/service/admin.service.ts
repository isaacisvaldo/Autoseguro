
import { CreateAdministratorDTO } from "../../admin/dto/create-admin.dto";
import { UpdateAdministratorDTO } from "../dto/update-admin.dto";
import { AdminRepository } from "../repository/admin.repository";

export class AdminService {
  constructor(private readonly adminRepository: AdminRepository) {
    console.log('AdminRepository constructor - adminRepository:', this.adminRepository);
  }
  async create(createAdministratorDTO: CreateAdministratorDTO) {
    return await this.adminRepository.create(createAdministratorDTO)
  }

  async findAll() {
    return await this.adminRepository.findAll();
  }

  async findByid(id: number) {
    return await this.adminRepository.findById(id);
  }
  async findByEmail(email: string) {
    return await this.adminRepository.findByEmail(email);
  }
  async findByPhone(phone: string) {
    return await this.adminRepository.findPhone(phone);
  }

  async update(id: number, updateAdministratorDTO: UpdateAdministratorDTO) {

    return await this.adminRepository.update(id, updateAdministratorDTO);
  }

  async remove(id: number) {
    return await this.adminRepository.delete(id);
  }
}
