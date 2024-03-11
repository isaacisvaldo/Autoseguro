import prisma from "../../../config/lib/prisma";
import { Funcionario } from "../dto/instructor-create";

export const funcionarioRepository = {
  async findAllFuncionario() {
    try {
      const funcionario = await prisma.tb_Funcionario.findMany({
        include: {
          tb_situacao_funcionario: true,
          tb_patente: {
            include: {
              tb_orgao: true,
            },
          },
          tb_user:{
            include:{
              tb_perfil:true,
              tb_grupo:true
            }
          },
        },
      });
      return funcionario;
    } catch (error) {
      throw new Error(`Erro ao buscar usuário: ${error}`);
    }
  },
  async  obterFuncionarioComMaiorId() {
    try {
      const funcionarioComMaiorId = await prisma.tb_Funcionario.findFirst({
        select: {
          funcionarioId: true,
        },
        orderBy: {
            funcionarioId: 'desc',
        },
      });
      return funcionarioComMaiorId?.funcionarioId;
    } catch (error) {
      console.error('Erro ao obter funcionário com maior ID:', error);
    } finally {
      await prisma.$disconnect();
    }
  },
  async findByID(funcionarioID: number) {
    try {
      const funcionario = await prisma.funcionario.findUnique({
        where: {
          funcionarioID: funcionarioID,
        },
      });
      return funcionario;
    } catch (error) {
      throw new Error(`Erro ao buscar usuário: ${error}`);
    }
  },
  async findNip(nip: string) {
    try {
      const funcionario = await prisma.tb_Funcionario.findMany({
        where: {
          nip: nip,
        },
      });
      return funcionario;
    } catch (error) {
      throw new Error(`Erro ao buscar usuário: ${error}`);
    }
  },
  async PersistData(data: Funcionario) {
    try {
      const funcionario = await prisma.tb_Funcionario.create({ data });
      console.log(funcionario);
      return { sucess: "Funcionario Cadastrado !" };
    } catch (error) {
      console.log(error);
      return { error: "Erro ao cadastrar Usuario" };
    }
  },
  async deleteFuncionario(funcionarioId: number) {
    try {
       await prisma.tb_Funcionario.delete({
        where: {
          funcionarioId: funcionarioId,
        },
      });
      return { sucess: "Funcionario Deletado !" };
    } catch (error) {
      return { error: "Erro interno !" };
    }
  },
  async findSituacaoFuncionario(){
    try {
      const situacao = await prisma.tb_Situacao_funcionario.findMany();
      return situacao;
    } catch (error) {
      throw new Error(`Erro ao buscar Postos: ${error}`);
    }
  },




  //Auxilares
 
  async findAllOrgao() {
    try {
      const departamento = await prisma.tb_Orgao.findMany({
      });
      return departamento;
    } catch (error) {
      throw new Error(`Erro ao buscar usuário: ${error}`);
    }
  },
  async findOnePatenteByOrgao(patenteId: number) {
    try {
      const patente = await prisma.tb_Patente.findMany({
        where: {
          fk_Orgao: patenteId,
        }
      });
      return patente;
    } catch (error) {
      throw new Error(`Erro ao buscar posto: ${error}`);
    }
  },
};



