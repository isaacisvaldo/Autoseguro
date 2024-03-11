
import { validateEmail } from "../../utils/validation/validation.all";
import { User } from "./dto/user.dto";
import { userRepository } from "./repository/user.repository";

export const UserService ={
  async  getHello():Promise <string> {
      return 'Seja Bem Vindo !';
    },
  async  getSigUp():Promise <string> {
      return 'Segurança Institucional !';
    },
 async  validation(data:User):Promise <any> {
        
      if(data.username == null || data.username==""){
          return {error:'Username Não pode estar vazio !'};
      }else if(!validateEmail(data.email)){
          return {error:'Adicione um Email Valido!'};  
      }else {
          //verificar se os dados ja se encontram presente
          const result = await userRepository.findByemail(data.email)
          const result2 = await userRepository.findByusername(data.username)
        
          if(result.length!=0){
              console.log(result)
              return {error:'Este Email ja encontra-se Cadastrado !'};     
          }else if(result2){
            return {error:'Este User name ja encontra-se Cadastrado !'}; 
          }
              return {sucess:'Dados Válidos !'};  
          }
      },
      
      
    }
  
