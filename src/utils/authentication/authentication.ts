import * as bcrypt from 'bcryptjs';

export const autenticationService = {
  async comparePasswords(senha: string, senha2: string) {
    try {
      return bcrypt.compare(senha, senha2);
    } catch (error) {
      throw new Error(`Erro Interno: ${error}`);
    }
  },
  async encryptPassword(senha: string) {
    try {
      const salt = await bcrypt.genSalt(10);
      return bcrypt.hash(senha, salt);
    } catch (error) {
      throw new Error(`Erro ao criptografar a senha: ${error}`);
    }
  }
}

