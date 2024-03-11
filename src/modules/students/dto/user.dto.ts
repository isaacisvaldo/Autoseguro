export interface User {
    username: string,
    image: string,
    fk_perfil: number,
    fk_grupo: number,
    email:string,
    password: string,
    fk_funcionario: number,
    status_ative?: boolean,   
  }