const express = require("express")
const router = express.Router();
const User = require("../models/User");
const Veiculo = require("../models/Veiculo")

const Notificacao = require("../models/Notificacao")
const bcrypt = require('bcryptjs');
const corretorAuth = require("../middlewares/corretorAuth")
const Contactos = require("../models/Contactos")
const Mypoints = require("../models/Mypoints");
const axios = require(`axios`);
const Op = require('sequelize').Op;
const Apolice = require("../models/Apolice");
const Relatorio = require('../models/Relatorio_sinistralidade')
const upload = require("../middlewares/upload");
const Relatorio_sinistralidade = require("../models/Relatorio_sinistralidade");
const { Sequelize } = require("sequelize");
const Alert_roubo = require('../models/alertar-roubo')
const Local = require(`../models/Local`);








router.get("/teste567" , async (req,res )=>{
   const u = await Relatorio_sinistralidade.findAll({attributes:["userId",[Sequelize.fn('count',Sequelize.col('userId')),'idcount']] ,group:"userId", order:["userId"],include:[{model:User,where:{role:2}}]}).catch(erro =>{console.log(erro)})
   const users = await User.findAll({where:{role:2}}).catch(erro =>{console.log(erro)})
        const q = u.map(element =>{
         const w =  users.map(e =>{
            if(element.dataValues.userId ==e.id){
               return {name:e.name,img:e.img,provincia:e.provincia,sexo:e.sexo,municipio:e.municipio,valor:element.dataValues.idcount}
            }else{
               return {name:e.name,img:e.img,provincia:e.provincia,sexo:e.sexo,municipio:e.municipio,valor:0}
            }
           })
         
           console.log(w) 
            
        })
       
       
      
})



router.get("/teste222" , async (req,res)=>{
      const dados = await axios.get("https://api.gov.ao/consultarBI/v2/?bi=006958705LA049").catch(erro =>{ console.log(erro) })
       dados.data.map(element =>{
         var estado_civil = element.MARITAL_STATUS_NAME;
         var Municipio = element.RESIDENCE_MUNICIPALITY_NAME;
         var Comunidade = element.RESIDENCE_COMMUNE_NAME;
         var genero = element.GENDER_NAME;
         var dat3 = new Date();
         var ano = (dat3.getFullYear())
         var c =element.BIRTH_DATE.split("-")
         var a =parseInt(c[0])
         var t = ano-a  
         console.log(t,estado_civil,Municipio,Comunidade,genero);  
         if(t < 27){
            //aumentar preco
            var g = 87;
            
         }
          if(genero == 'MASCULINO'){
            //aumentar preco
            console.log("MASCULINO")
         }
          if(estado_civil == 'Solteiro'){
            //aumentar preco
            console.log(" SOU SOLTEIRO")
         }
       
         
         
       })
    

})
// relatorio de notificaçºoes validadr  se a data inicio foi maior que a data fim tem que dar erro
router.get("/teste00" , async (req,res) =>{
   var d ="2022-03-23";
   var f= "2022-05-23";
   var sexo ="MASCULINO"

   var tipo = "Roubo"
   if(tipo == "Roubo"){
      const  roubo = await Alert_roubo.findAll({ 
         where:{
            
            createdAt:{
               [Op.between]:[new Date(d) ,new Date(f)]
            }
         },
       include:[
          {
             model:User,
             where:{
       Sexo:sexo
             }
          }
       ]
      }).catch(erro =>{ console.log(erro) })
    
      const r = roubo.map(e=>{
         return {nome:e.dataValues.user.name,tel:e.dataValues.user.tel,email:e.dataValues.user.email,tipo:"Roubo de Viatura"}
      })
 console.log(r)

   }else if(tipo == "Roubo"){
   const  notify = await Notificacao.findAll({ 
      where:{
         
         createdAt:{
            [Op.between]:[new Date(d) ,new Date(f)]
         }
      },
    include:[
       {
          model:User,
          where:{
    Sexo:sexo
          }
       }
    ]
   }).catch(erro =>{ console.log(erro) })
        const t = notify.map(e=>{
           return {nome:e.dataValues.user.name,tel:e.dataValues.user.tel,email:e.dataValues.user.email,tipo:"Acidente Rodoviario"}
        })
   console.log(t)
}else{
  // Se for Os dois
 // tenho Que juntar os array 
}
    
})








router.get("/corretor/notificacao", corretorAuth, async (req, res) => {
  const user = await User.findOne({ where: { id: req.session.user.id } }).catch(erro =>{ console.log(erro)})
  const local = await Local.findAll({where:{userId:req.session.user.id},raw:true}).catch(err =>{console.log(err)})
 var notificacao =[];


if(local.length == 4){
   const a =local[0].municipio;
   const b =local[1].municipio;
   const c =local[2].municipio;
   const d =local[3].municipio;
   notificacao = await Notificacao.findAll({where:{[Op.or]: [{ municipio:a},{ municipio:b},{ municipio:c},{ municipio:d}] ,estado:0 },raw:true}).catch(err =>{console.log(err)})

}else if(local.length == 3){
   const a =local[0].municipio;
   const b =local[1].municipio;
   const c =local[2].municipio;
  
     notificacao = await Notificacao.findAll({where:{[Op.or]: [{ municipio:a},{ municipio:b},{ municipio:c}] ,estado:0 },raw:true}).catch(err =>{console.log(err)})
}else if(local.length == 2){
   const a =local[0].municipio;
   const b =local[1].municipio;
  
    notificacao= await Notificacao.findAll({where:{[Op.or]: [{ municipio:a},{ municipio:b}],estado:0 },raw:true}).catch(err =>{console.log(err)})
  
}else if(local.length == 1){
   const a =local[0].municipio;
 
     notificacao = await Notificacao.findAll({where:{municipio:a ,estado:0 },raw:true}).catch(err =>{console.log(err)})
}else{
 notificacao =[];
}
 //

 console.log(notificacao)
 res.render("corretor/notificacao", {  notificacao,user,certo:req.flash('certo'),errado:req.flash('errado')})
 

 

})
router.get("/Oporedor/rotas/:id", corretorAuth, async (req, res) => {
   const{id}= req.params;
   console.log(id)
   const user = await User.findOne({ where: { id: req.session.user.id } }).catch(erro =>{ console.log(erro)})
   const local = await Local.findAll({where:{userId:req.session.user.id},raw:true}).catch(err =>{console.log(err)})
  var notificacao =[];
 
 
 if(local.length == 4){
    const a =local[0].municipio;
    const b =local[1].municipio;
    const c =local[2].municipio;
    const d =local[3].municipio;
    notificacao = await Notificacao.findAll({where:{[Op.or]: [{ municipio:a},{ municipio:b},{ municipio:c},{ municipio:d}] ,estado:0 },raw:true}).catch(err =>{console.log(err)})
 
 }else if(local.length == 3){
    const a =local[0].municipio;
    const b =local[1].municipio;
    const c =local[2].municipio;
   
      notificacao = await Notificacao.findAll({where:{[Op.or]: [{ municipio:a},{ municipio:b},{ municipio:c}] ,estado:0 },raw:true}).catch(err =>{console.log(err)})
 }else if(local.length == 2){
    const a =local[0].municipio;
    const b =local[1].municipio;
   
     notificacao= await Notificacao.findAll({where:{[Op.or]: [{ municipio:a},{ municipio:b}],estado:0 },raw:true}).catch(err =>{console.log(err)})
   
 }else if(local.length == 1){
    const a =local[0].municipio;
  
      notificacao = await Notificacao.findAll({where:{municipio:a ,estado:0 },raw:true}).catch(err =>{console.log(err)})
 }else{
  notificacao =[];
 }
  //
 
  console.log(notificacao)
   const not1 = await Notificacao.findOne({where:{id:id}}).catch(erro =>{ console.log(erro)})
   console.log(not1)
 
  
 if(not1){
    const apolice = await Apolice.findOne({where:{matricula:not1.matricula}}).catch(erro =>{ console.log(erro)})

 const veiculo = await Veiculo.findOne({where:{matricula:not1.matricula},include: [{ model: User }]}).catch(err =>{console.log(err)})
     if(veiculo && apolice){

      res.render("corretor/rotas", {veiculo,apolice, not1,notificacao,user,certo:req.flash('certo'),errado:req.flash('errado')})
   
     }else{
      req.flash('errado',"")
      res.redirect("/corretor/notificacao")
     }
     
}
 })
 router.get("/Oficinas/rotas/:id", corretorAuth, async (req, res) => {
   const{id}= req.params;
   console.log(id)
  
   const user = await User.findOne({ where: { id: req.session.user.id } }).catch(erro =>{ console.log(erro)})
   const local = await Local.findAll({where:{userId:req.session.user.id},raw:true}).catch(err =>{console.log(err)})
  var notificacao =[];
 
 
 if(local.length == 4){
    const a =local[0].municipio;
    const b =local[1].municipio;
    const c =local[2].municipio;
    const d =local[3].municipio;
    notificacao = await Notificacao.findAll({where:{[Op.or]: [{ municipio:a},{ municipio:b},{ municipio:c},{ municipio:d}] ,estado:0 },raw:true}).catch(err =>{console.log(err)})
 
 }else if(local.length == 3){
    const a =local[0].municipio;
    const b =local[1].municipio;
    const c =local[2].municipio;
   
      notificacao = await Notificacao.findAll({where:{[Op.or]: [{ municipio:a},{ municipio:b},{ municipio:c}] ,estado:0 },raw:true}).catch(err =>{console.log(err)})
 }else if(local.length == 2){
    const a =local[0].municipio;
    const b =local[1].municipio;
   
     notificacao= await Notificacao.findAll({where:{[Op.or]: [{ municipio:a},{ municipio:b}],estado:0 },raw:true}).catch(err =>{console.log(err)})
   
 }else if(local.length == 1){
    const a =local[0].municipio;
  
      notificacao = await Notificacao.findAll({where:{municipio:a ,estado:0 },raw:true}).catch(err =>{console.log(err)})
 }else{
  notificacao =[];
 }
const oficina = await Mypoints.findOne({where:{id:id}}).catch(erro => { console.log(erro) })
 
  console.log(notificacao)
  res.render("corretor/oficina",{user,notificacao,oficina})

     

 })
 router.get(`/clientesistema`, corretorAuth, async (req, res) => {
   const user = await User.findOne({ where: { id: req.session.user.id } }).catch(erro =>{ console.log(erro)})
   const local = await Local.findAll({where:{userId:req.session.user.id},raw:true}).catch(err =>{console.log(err)})
  var notificacao =[];
 
 
 if(local.length == 4){
    const a =local[0].municipio;
    const b =local[1].municipio;
    const c =local[2].municipio;
    const d =local[3].municipio;
    notificacao = await Notificacao.findAll({where:{[Op.or]: [{ municipio:a},{ municipio:b},{ municipio:c},{ municipio:d}] ,estado:0 },raw:true}).catch(err =>{console.log(err)})
 
 }else if(local.length == 3){
    const a =local[0].municipio;
    const b =local[1].municipio;
    const c =local[2].municipio;
   
      notificacao = await Notificacao.findAll({where:{[Op.or]: [{ municipio:a},{ municipio:b},{ municipio:c}] ,estado:0 },raw:true}).catch(err =>{console.log(err)})
 }else if(local.length == 2){
    const a =local[0].municipio;
    const b =local[1].municipio;
   
     notificacao= await Notificacao.findAll({where:{[Op.or]: [{ municipio:a},{ municipio:b}],estado:0 },raw:true}).catch(err =>{console.log(err)})
   
 }else if(local.length == 1){
    const a =local[0].municipio;
  
      notificacao = await Notificacao.findAll({where:{municipio:a ,estado:0 },raw:true}).catch(err =>{console.log(err)})
 }else{
  notificacao =[];
 }
  //
 
  console.log(notificacao)
   const apolice = await Apolice.findAll({ include: [{ model: User }]}).catch(erro => { console.log(erro) })
console.log(apolice)
      res.render(`corretor/clientes`, {apolice,user,notificacao});
 
  

});
router.get("/oficinas/mapa", corretorAuth, async(req, res) => {
   const user = await User.findOne({ where: { id: req.session.user.id } }).catch(erro =>{ console.log(erro)})
   const local = await Local.findAll({where:{userId:req.session.user.id},raw:true}).catch(err =>{console.log(err)})
  var notificacao =[];
 
 
 if(local.length == 4){
    const a =local[0].municipio;
    const b =local[1].municipio;
    const c =local[2].municipio;
    const d =local[3].municipio;
    notificacao = await Notificacao.findAll({where:{[Op.or]: [{ municipio:a},{ municipio:b},{ municipio:c},{ municipio:d}] ,estado:0 },raw:true}).catch(err =>{console.log(err)})
 
 }else if(local.length == 3){
    const a =local[0].municipio;
    const b =local[1].municipio;
    const c =local[2].municipio;
   
      notificacao = await Notificacao.findAll({where:{[Op.or]: [{ municipio:a},{ municipio:b},{ municipio:c}] ,estado:0 },raw:true}).catch(err =>{console.log(err)})
 }else if(local.length == 2){
    const a =local[0].municipio;
    const b =local[1].municipio;
   
     notificacao= await Notificacao.findAll({where:{[Op.or]: [{ municipio:a},{ municipio:b}],estado:0 },raw:true}).catch(err =>{console.log(err)})
   
 }else if(local.length == 1){
    const a =local[0].municipio;
  
      notificacao = await Notificacao.findAll({where:{municipio:a ,estado:0 },raw:true}).catch(err =>{console.log(err)})
 }else{
  notificacao =[];
 }
  //
 
  console.log(notificacao)

const dados = await Mypoints.findAll({where:{entidade:1}}).catch(erro => { console.log(erro) })


 res.render("corretor/mapa", { user,dados,notificacao })

 

})

router.get("/tecnico/relatar/:id",corretorAuth, async (req, res) => {
   const {id}= req.params;
   const user = await User.findOne({ where: { id: req.session.user.id } }).catch(erro =>{ console.log(erro)})
   const  notificacao = await Notificacao.findAll({where:{municipio:req.session.user.municipio,estado:0}}).catch(err =>{console.log(err)})
  
   const noti = await  Notificacao.findOne({
     
      where: {
         id: id
      },
      include: [{ model: User }]

   }).catch(erro =>{ console.log(erro)})
   console.log(noti)

   if(noti){
const apolice = await  Apolice.findOne({ where: {matricula: noti.dataValues.matricula }})
const veiculo = await  Veiculo.findOne({ where: {matricula: noti.dataValues.matricula }})
         if(apolice){
        
               res.render("corretor/form/relatorio", {user:user,notificacao, noti, apolice,veiculo})
             
         }else{
            req.flash('errado',"Ocorreu um problema")
            res.redirect("/corretor/notificacao") 
         }
   }else{
      req.flash('errado',"Ocorreu um problema")
      res.redirect("/corretor/notificacao")
   }
 

});


//salvar o relatorio da notificacao
router.post("/tecnico/salvar/registo",upload.single("image"), async (req, res) => {
   const {matricula_terceiro,bi,idn,descricao,tipo}= req.body;
   var data = new Date();
  const mes =(data.getMonth() + 1)


  
 
   var img_atual = req.file.filename;
   if(img_atual===""){req.flash('errado',"Registo nao foi enviado")
   res.redirect("/corretor/notificacao")}
  
   if (matricula_terceiro == null || bi == null) {
      const relatorio = await Relatorio.create({
         matricula_terceiro:'0',
          bi: '0', 
          tipo_sinistralidade: tipo,
         img_atual:img_atual,
          descricao: descricao, 
          estado:0,
          mes:mes,
         notificacoId: idn ,
         userId:req.session.user.id
      }).catch(err =>{console.log(err)})
      if(relatorio){
const notificacao = await Notificacao.update({ estado: 3 }, {
   where: {
      id: idn
   }
}).catch(err =>{console.log(err)})
if(notificacao){
   req.flash('certo',"Registo foi enviado")
   res.redirect("/corretor/notificacao")
}else{
   req.flash('errado',"Registo nao foi enviado")
            res.redirect("/corretor/notificacao")
}

      }else{
         req.flash('errado',"Registo nao foi enviado")
         res.redirect("/corretor/notificacao")
      }
    
 

   } else {
        const result =/^[0-9]{9}[A-Z]{2}[0-9]{3}$/.test(bi)
      if(result == true){
         const relatorio = await Relatorio.create({
            matricula_terceiro: matricula_terceiro,
             bi:bi, 
             tipo_sinistralidade: tipo,
              img_atual: img_atual,
               descricao: descricao,
               estado:0,
               mes:mes,
               notificacoId: idn ,
               userId:req.session.user.id
         }).catch(err =>{console.log(err)})
         if(relatorio){
            const notificacao = await  Notificacao.update({ estado: 3 }, {
               where: {
                  id:idn
               }
            }).catch(err =>{console.log(err)})
            if(notificacao){
               req.flash('certo',"Registo foi enviado")
               res.redirect("/corretor/notificacao")
            }else{ req.flash('errado',"Registo nao foi enviado")
            res.redirect("/corretor/notificacao")}
         }else{ req.flash('errado',"Registo nao foi enviado")
         res.redirect("/corretor/notificacao")}
        
        }else{
         req.flash('errado',"BI não é válido")
         res.redirect("/corretor/notificacao")
        }
   }



})


router.post(`/corretor/perfil/update`, corretorAuth, async (req, res) => {
   var name = req.body.name;
   var email = req.body.email;
   var tel = req.body.tel;
   var user_name = req.body.user_name;
     if(!(name==="" || email==="===" || tel === "")){
      let re = /[A-Z]/;
      const number =  /^[9]{1}[0-9]{8}$/.test(tel)
      const hasUpper = re.test(user_name );
      const verificaEspaco =(user_name) => /\s/g.test(user_name);
      const Mailer =/^[^ ]+@[^ ]+\.[a-z]{2,3}$/.test(email);
       
      if (hasUpper === true) {
         req.flash('errado', " Erro ao atualizar os dados")
         res.redirect("/corretor/index")
     
        
      }else if (verificaEspaco === true) {
         req.flash('errado', " Erro ao atualizar os dados")
      res.redirect("/corretor/index")
      
     }else if(!Mailer){
      req.flash('errado', " Erro ao atualizar os dados")
      res.redirect("/corretor/index")
     }else if(number != true){
         req.flash('info',"Numero de Telefone Invalido");
         res.redirect("/corretor/index")
        }else{
         const user = await User.update({ name: name, email: email, tel: tel, user_name: user_name}, {
            where: {
               id: req.session.user.id
            }
         }).catch(err =>{console.log(err)})
           if(user){
            req.flash('certo', " Dados atualizado com sucesso!")
            res.redirect(`/corretor/index`)
           }else{
            req.flash('errado', " Erro ao atualizar os dados")
            res.redirect("/corretor/index")
           }
        }

     }else{req.flash('info',"Numero de Telefone Invalido");
     res.redirect("/corretor/index")}
  
  

})



module.exports = router;