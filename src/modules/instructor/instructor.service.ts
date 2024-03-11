import { Funcionario } from "./dto/instructor-create";
import { funcionarioRepository } from "./repository/instructor.repository";

export const EmployeeService ={
    async  validation(data:Funcionario):Promise <any> {
        
        if(data.nome == null || data.nome==""){
            return {error:'Nome Não pode estar vazio !'};
        }else if(data.sobre_nome== null || data.sobre_nome==""){
            return {error:'Sobrenome Não pode estar vazio !'};
        }else if(data.nip== null || data.nip==""){
            return {error:'Nip  Não pode estar vazio !'};
        }else if(data.fk_patente== null || data.fk_patente==undefined ){
            return {error:'Patente  Não pode estar vazio !'}; 
        }else if(data.fk_situacao==null || data.fk_situacao==undefined){
            return {error:'Patente  Não pode estar vazio !'};   
        }else {
            //verificar se os dados ja se encontram presente
            const result = await funcionarioRepository.findNip(data.nip)
            if(result.length!=0){
                console.log(result)
                return {error:'Este NIP ja encontra-se Cadastrado !'};     
            }else{
                return {sucess:'Dados Válidos !'};  
            }
        }
        
      },

     
    }