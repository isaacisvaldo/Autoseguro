import prisma from "../../../config/lib/prisma";
import { User } from "../dto/user.dto";
import { Logs } from "../types/types";



export const userRepository = {
  async findByusername(username: string) {
    try {
      const user = await prisma.tb_User.findUnique({
        where: {
          username: username
        },
        include: {
          tb_funcionario: {
            include: {
              tb_area:true,
              tb_situacao_funcionario: true,
              tb_contacto: true,
              tb_patente: {
                include: {
                  tb_orgao: true,
                }
              }
              }
          },
          tb_grupo: true,
          tb_perfil: true,

        }
      });

      return user;
    } catch (error) {
      throw new Error(`Erro ao buscar usuário: ${error}`);
    }
  },
  async countAllUserOnOff() {
    try {
      const contagemPorStatus = await prisma.tb_User.groupBy({
        by: ['status_ative'],
        _count: true,
      });

      const resultados = {
        on: 0,
        off: 0,
      };
      contagemPorStatus.forEach((status) => {
        const chave = status.status_ative === true ? 'on' : 'off';
        resultados[chave] += status._count;
      });
      return resultados;
    } catch (error) {
      throw new Error(`Erro ao buscar usuário: ${error}`);
    }


  },
  async findByemail(email: string) {
    try {
      const user = await prisma.tb_User.findMany({
        where: {
          email: email,
        },
        include: {
          tb_grupo: true,
          tb_perfil: true
        }
      });

      return user;
    } catch (error) {
      throw new Error(`Erro ao buscar usuário: ${error}`);
    }
  },
  async findById(userId: number) {
    try {
      const user = await prisma.tb_User.findUnique({
        where: {
          userId: userId,
        },
        include: {
         tb_funcionario: {
            include: {
              tb_area: {
                include: {
                  tb_area_chefe_area: true
                }
              },
              tb_contacto: true,
              tb_patente: {
                include: {
                  tb_orgao: true,
                }
              }
            }
          },
          tb_grupo: true,
          tb_perfil: true,

        }
      });

      return user;
    } catch (error) {
      throw new Error(`Erro ao buscar usuário: ${error}`);
    }
  },
  async findAll() {
    try {
      const user = await prisma.tb_User.findMany({
        include: {
          tb_grupo: true,
          tb_perfil: true
        }
      });

      return user;
    } catch (error) {
      throw new Error(`Erro ao buscar usuário: ${error}`);
    }
  },
  async persistirDatalogsuser(data: Logs) {
    try {
      const logs = await prisma.tb_Log.create({ data });

      return logs;
    } catch (error) {
      throw new Error(`Erro ao Cadatrar o log: ${error}`);
    }
  },
  async findlogOneUser(fk_user: number) {
    try {
      const logs = await prisma.tb_Log.findMany({
        where: {
          fk_user: fk_user
        }
      });

      return logs;
    } catch (error) {
      throw new Error(`Erro ao buscar usuário: ${error}`);
    }
  },
  async findAllogs() {
    try {
      const logs = await prisma.tb_Log.findMany({
        include: {
          tb_user: true
        }
      });

      return logs;
    } catch (error) {
      throw new Error(`Erro ao buscar usuário: ${error}`);
    }
  },
  async findLogById(logId: number) {
    try {
      const logs = await prisma.tb_Log.findUnique({
          where:{
          logId: logId
          },
          include: {
            tb_user: {
              include:{
                tb_funcionario: true
              }
            }
          }
      });

      return logs;
    } catch (error) {
      throw new Error(`Erro ao buscar usuário: ${error}`);
    }
  },
  async updateavatar(userId: number, avatar: string) {
    try {
      const updatedUser = await prisma.tb_User.update({
        where: {
          userId: userId,
        },
        data: {

          image: avatar,

        },
      });
      return { sucess: "Imagem Editada com sucesso !" };

    } catch (error) {
      throw new Error(`Erro ao buscar usuário: ${error}`);
    }
  },
  async persistirDataUser(data: User) {
    try {
      const user = await prisma.tb_User.create({ data });
      return { sucess: "Usuario Cadastrado !" };
    } catch (error) {
      console.log(error);
      return { error: "Erro ao cadastrar Usuario" };
    }
  },
  async deleteuser(userId: number) {
    try {
      const user = await prisma.tb_User.delete({
        where: {
          userId: userId,
        },
      });
      return { sucess: "Usuario Deletado !" };
    } catch (error) {
      return { error: "Erro interno !" };
    }
  },
  async updateStatus_ative(userId: number, status: boolean) {
    try {
      await prisma.tb_User.update({
        where: {
          userId: userId,
        },
        data: {
          status_ative: status
        }
      });
      return { sucess: "Usuario Deletado !" };
    } catch (error) {
      return { error: "Erro interno !" };
    }
  },

    //Auxilares
    async findAllPerfil() {
      try {
        const perfil = await prisma.tb_Perfil.findMany({
        });
        return perfil;
      } catch (error) {
        throw new Error(`Erro ao buscar perfil: ${error}`);
      }
    },
    async findAllGrupo() {
      try {
        const grupo = await prisma.tb_Grupo.findMany({
        });
        return grupo;
      } catch (error) {
        throw new Error(`Erro ao buscar perfil: ${error}`);
      }
    },
}

