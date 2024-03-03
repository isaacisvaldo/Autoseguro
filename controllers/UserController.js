const express = require("express")
const router = express.Router();
const User = require("../models/User");
const Veiculo = require("../models/Veiculo")
const Notificacao = require("../models/Notificacao")
const bcrypt = require('bcryptjs');
const userAuth = require("../middlewares/userAuth")
const Contactos = require("../models/Contactos")
const Mypoints = require("../models/Mypoints");
const res = require("express/lib/response");
const Apolice = require("../models/Apolice")
const Marcacoes = require('../models/Marcacoes');
const upload = require("../middlewares/upload")
const axios = require("axios");
const cors = require("cors");
const prev = require("../middlewares/Sessao")
const Op = require('sequelize').Op;
const Registo_login = require('../models/Registo_login');
const Alert_roubo = require('../models/alertar-roubo')
const Qr = require('qrcode')
const adminAuth = require("../middlewares/adminAuth")
const Inscritos = require("../models/Inscritos")
const Relatorio_sinistralidade = require("../models/Relatorio_sinistralidade");
const corretorAuth = require("../middlewares/corretorAuth")
const Documentos = require('../models/Documentos');
const Fundos = require("../models/Fundos")
const Comprovativo = require('../models/Comprovativo');
const RankNotificacoes = require("../models/RankNotificacao")
const { Sequelize, where } = require("sequelize");
var Os = require('os');
const Local = require(`../models/Local`);
const DadosP= require("../middlewares/dados");
const { append } = require("express/lib/response");



router.get("/guiapagamento/:id", userAuth, async (req,res) =>{
   const {id}= req.params;
   const guia = await Marcacoes.findOne({where:{id:id}, include: [{ model: User }]}).catch(err =>{console.log(err)})
   if(guia){
      console.log(guia)
         res.render("user/PDF/pagamento",{guia})
   }else{
res.render("error/errors-403")
   }
})


router.post("/criarconta", async(req,res)=>{
   //Add Validações
  
   const{endereco,name,email,tel,user_name,senha,senha2,nif,sexo,provincia,municipio,nascimento,estado_civil,matricula,modelo,marca,tipo, servico, lotacao,peso, combustivel, tipo_caixa, distancia_eixo, cilindrada, numero_cilindro, medida_pneumaticos, numero_quadro, tara, numero_motor,cor }= req.body; 
 console.log(senha.length)
   var bi= /^[0-9]{9}[A-Z]{2}[0-9]{3}$/.test(nif)
 

   if (!(endereco ==="" || email==="" || user_name ==="" || senha === "" || senha2=="" || tel === "")) {
    var dat3 = new Date();
    var ano = (dat3.getFullYear())
    var c =nascimento.split("-")
    var a =parseInt(c[0])
    var t = ano-a 

      let re = /[A-Z]/;
      const hasUpper = re.test(user_name);
      const verificaEspaco = (user_name) => /\s/g.test(user_name);
      const Mailer = /^[^ ]+@[^ ]+\.[a-z]{2,3}$/.test(email);
      const number = /^[9]{1}[0-9]{8}$/.test(tel)
 if(t > 90){
   req.flash('errado', "Idade Superior");
   res.redirect("/registar_se")
 }else
      if(t < 18){
         req.flash('errado', "Idade inferio aos 18");
         res.redirect("/registar_se")
      }else if (hasUpper === true) {
         req.flash('errado', "nao cadastrado");
         res.redirect("/registar_se")


      } else if (verificaEspaco === true) {
         req.flash('errado', "nao cadastrado");
         res.redirect("/registar_se")

      } else
         if (!Mailer) {
            req.flash('errado', "nao cadastrado");
            res.redirect("/registar_se")
         } else
            if (senha.length < 5) {
               req.flash('errado', "Senha muito fraca");
               res.redirect("/registar_se")
            } else
               if (senha != senha2) {
                  req.flash('errado', "Senha Diferentes");
                  res.redirect("/registar_se")

               } else if(number == false) {
                  req.flash('info', "Numero de Telefone incorreto");
                  res.redirect("/registar_se")
   
               }else{
                  req.session.dados = undefined;
                  const user= await User.findOne({ where: { email: email } }).catch(err =>{console.log(err)})
                  if(!user){
                  const user= await  User.findOne({ where: { tel: tel } }).catch(err =>{console.log(err)})
                   if(!user){
                  const user= await   User.findOne({ where: { user_name: user_name } }).catch(err =>{console.log(err)})
                  if(!user){
                     

                   
                     if (!(matricula===""||modelo===""||marca===""||servico===""||numero_motor===""||numero_quadro===""||medida_pneumaticos==="")) {
                     //    let hasUpper1 = /^[A-Z]{2}[-][0-9]{2}[-][0-9]{2}[-][A-Z]{2}$/.test(matricula)
                     //  n  =/[A-Z][0-9]/.test(numero_quadro)
                     //  ci =/[0-9]/.test(cilindrada)
                     //  me = /[0-9][A-Z]/.test(medida_pneumaticos)
                     //  nmotor = /[A-Z][0-9]/.test(numero_motor)
                    // if(hasUpper1 == false || n== false||ci== false||me== false||nmotor== false){
                       let f =0
                         if(f==1){
                               req.flash("errado","Dados invalidos")
                          res.redirect("/registar_se")
                        }else{
                           const veiculo =0
                         //const veiculo = await Veiculo.findOne({ where: { [Op.or]: [{ matricula: matricula }, { numero_motor: numero_motor }] } }).catch(err =>{console.log(err)})
                                 if(veiculo==0){
                                    var salt = bcrypt.genSaltSync(10);
                                    var hash = bcrypt.hashSync(senha, salt);
                                    const user = await User.create({name:name, email: email,tel:tel,user_name:user_name,img:'unknown.png',password: hash,provincia:provincia,municipio:municipio,endereco:endereco,sexo:sexo,nascimento:nascimento,estado_civil:estado_civil,nif:nif,estado:1,role:0}).catch(err =>{console.log(err);req.flash('info', "Occoreeu um problema")});
                                 
                                    if(user){
                                       const veiculo = await   Veiculo.create({
                                          tipo: tipo,
                                          marca: marca,
                                          modelo: modelo,
                                          cor: cor,
                                         
                                          servico:servico,
                                          matricula: matricula,
                                         
                                          lotacao: lotacao,
                                          combustivel: combustivel,
                                          tipo_caixa: tipo_caixa,
                                          distancia_eixo: distancia_eixo,
                                          cilindrada: cilindrada,
                                          numero_cilindro: numero_cilindro,
                                          medidas_pneus: medida_pneumaticos,
                                          numero_quadro: numero_quadro,
                                          tara: tara,
                                          numero_motor: numero_motor,
                                          peso: peso,
                                          estado: 0,
                                          userId: user.id
                                       }).catch(err =>{console.log(err)})
                                 
                                       if(veiculo){
                                          req.flash('certo', "a sua conta foi Criada")
                                          res.redirect("/formlogin");
                                       }else{
                                          const user = await User.destroy({where:{id: user.id}}).catch(err =>{console.log(err)})
                                          req.flash('errado', "Ocorreu um problema")
                                          res.redirect("/registar_se");
                                       }
                                    }
                                   
                                    
                                  
                  
                                 }else{req.flash('errado', "Registos presentes")
                                 res.redirect("/viatura");}
                              }
                              }else{req.flash('errado', "Registos presentes")
                              res.redirect("/viatura");}
               
                  }else{req.flash('info', "Email existenta");
                  res.redirect("/registar_se")}
                   }else{req.flash('info', "Contacto Existenta");
                   res.redirect("/registar_se")}
                  }else{req.flash('info', "User name Existente");
                  res.redirect("/registar_se")}

      
                 
               
               }
           
   } else {
      console.log("vazio")
      req.flash('errado', "Ocorreu um problema");
      res.redirect("/registar_se")
   }


})
// Renovar o Seguro
router.post("/renovar",userAuth, async (req,res)=>{
   const {id,plano_desejado,tipo_seguro,franquia}= req.body;
   if(!(id ===""||plano_desejado ===""||tipo_seguro===""||franquia =="")){

  
   const apolice = await Apolice.findByPk(id).catch(err =>{console.log(err)})
   if(apolice){
      const veiculo = await Veiculo.findOne({where:{matricula:apolice.matricula}}).catch(err =>{console.log(err)})
      var dias ;
      var mes ;
      var marc =0;
      var ci= 0;
      var n_cilindro =0
      const MarcasCaras= ["BMW","FERRARI","TOYOTA","LAMBORGUINI"]
      if(tipo_seguro == 3){
         if(veiculo.numero_cilindro > 4){
            n_cilindro = 1000
         }else if(veiculo.cilindrada > 200){
            ci = 1000
         }else if((MarcasCaras.includes(Veiculo.marca))== true){
            marc =1000
         }
   
      }
   
      if (plano_desejado == "mensal") {
         dias = 30;
         mes = 2;
   
      } else if (plano_desejado == "trimestral") {
         dias = 30 * 3;
         mes = 4;
      } else if (plano_desejado == "anual") {
         dias = 365;
         mes = 13;
      } else if (plano_desejado == "simestral") {
         dias = 30 * 6;
   
         mes = 7;
      }
      const apoli = await Apolice.update({plano_desejado:plano_desejado,tipo_seguro:tipo_seguro,franquia:franquia,estado:0,valor:0},{where:{id:id}})
          if(apoli){
            var pagar = (1500 * tipo_seguro * mes) +(marc + ci + n_cilindro)
         const getRandomIntegerInclusive = (min, max) =>
            Math.floor(Math.random() * (max - min + 1)) + min
         var data_marcacao = getRandomIntegerInclusive(5, 9);
         const marcacao = await  Marcacoes.create({ secret:apolice.secret , quantia_pagar: pagar, data_marcacao: data_marcacao, estado: 0, userId:req.session.user.id}).catch(err =>{console.log(err)})
           
         if(marcacao){
            req.flash('certo', `criado ,tens ${data_marcacao} dias para Efetuar o Pagamento`)
            res.redirect("/user/index");
         }else{
            req.flash('errado', "Ocorreu um problema")
           res.redirect("/user/index");
         }
          }else{

          }
   }else{
      res.render("error/errors-404") 
   }
}else{
   req.flash('errado', "Ocorreu um problema")
   res.redirect("/user/index") 
}

})
router.get("/user/tipo/renovar/:id", userAuth, async (req, res) => {
   const {id}= req.params;
   const apolice = await Apolice.findByPk(id).catch(err =>{console.log(err)})
   if(apolice != undefined){
   const user = await User.findOne({ where: { id: req.session.user.id } }).catch(err =>{console.log(err)});
   if(user != undefined){
      res.render("user/form/tipo_seguroupdate", {user,id});
   }else{
      res.render("error/errors-404")
   }
   }else{
      res.render("error/errors-404")
   }
  

})

router.get("/renovar/seguro/:valor/:id",userAuth, async (req, res) => {
   const{id,valor}= req.params;
   const user = await User.findOne({ where: { id: req.session.user.id } }).catch(err =>{ console.log(err)})
   const apolice = await Apolice.findByPk(id).catch(err =>{console.log(err)})
   if(apolice){
      res.render("user/form/renovar", {user,valor, apolice,errado: req.flash('errado'), info: req.flash('info') })
   }else{
      res.render("error/errors-404")
   }
  
  
  })

router.get("/pagamentos/:id",userAuth, async (req, res) => {
   const{id}= req.params;
   const user = await User.findOne({ where: { id: req.session.user.id } }).catch(err =>{ console.log(err)})
   const marcacao = await Marcacoes.findByPk(id).catch(err =>{console.log(err)})
   if(marcacao){
      res.render("user/form/pagamentos", {user, marcacao,errado: req.flash('errado'), info: req.flash('info') })
   }else{
      res.render("error/errors-404")
   }
  
  
  })
  router.post("/pagamentos", upload.single("comp"), userAuth, async (req, res) => {
     const {id}= req.body;
   const comp = req.file.filename;
   const comprovativo = await Marcacoes.findByPk(id).catch(err =>{console.log(err)})
   if (comprovativo){

     
      const pagamento = await Comprovativo.create({comprovativo:comp,estado:0,marcacoId:comprovativo.id}).catch(err =>{console.log(err)})
      if(pagamento){
         const marc = await Marcacoes.update({estado:1},{where:{id:comprovativo.id}}).catch(err =>{console.log(err)})
         
         req.flash('certo', "Pagamento efetuado")
         res.redirect("/user/index")
      }else{
   req.flash('errado', "Ocorreu um problema")
    res.redirect(`/pagamentos/${comprovativo.id}`)
      }
   }else{
      req.flash('errado', "Ocorreu um problema")
      res.redirect("/user/index")
   }
})

router.get("/registar_se", async (req, res) => {
 res.render("form/registar_se", { errado: req.flash('errado'), info: req.flash('info') })

})
/* Dados temporarios
router.get("/viatura", DadosP, async (req, res) => {
 res.render("form/veiculo",{titular:req.session.dados.name,errado: req.flash('errado'), info: req.flash('info') })  
  })
  router.post("/viatura/new" ,DadosP,async(req, res) => {
   var senha = req.session.dados.senha;
 
   const {id,cor,matricula,data_fabrico,modelo,marca,tipo, servico, lotacao,peso, combustivel, tipo_caixa, distancia_eixo, cilindrada, numero_cilindro, medida_pneumaticos, numero_quadro, tara, numero_motor } = req.body;


   if (!(matricula===""||modelo===""||marca===""||servico===""||numero_motor===""||numero_quadro===""||medida_pneumaticos==="")) {
      let hasUpper1 = /^[A-Z]{2}[-][0-9]{2}[-][0-9]{2}[-][A-Z]{2}$/.test(matricula)
    n  =/[A-Z][0-9]/.test(numero_quadro)
    ci =/[0-9]/.test(cilindrada)
    me = /[0-9][A-Z]/.test(medida_pneumaticos)
    nmotor = /[A-Z][0-9]/.test(numero_motor)
          if(hasUpper1 == false || n== false||ci== false||me== false||nmotor== false){
             res.flash("errado","Dados invalidos")
res.redirect("/viatura")
      }else{

     
   
   const veiculo = await Veiculo.findOne({ where: { [Op.or]: [{ matricula: matricula }, { numero_motor: numero_motor }] } }).catch(err =>{console.log(err)})
               if(!veiculo){
                  console.log(req.session.dados.name,senha)
                  
                  var salt = bcrypt.genSaltSync(10);
                  var hash = bcrypt.hashSync(senha, salt);
                  const user = await User.create({name:req.session.dados.name, email: req.session.dados.email,tel: req.session.dados.tel,user_name: req.session.dados.user_name,img: req.session.dados.img,password: hash,provincia: req.session.dados.provincia,municipio: req.session.dados.municipio,endereco:req.session.dados.endereco,sexo:req.session.dados.sexo,nascimento:req.session.dados.nascimento,estado_civil:req.session.dados.estado_civil,estado:1,role:0}).catch(err =>{console.log(err);req.flash('info', "Occoreeu um problema");
                  res.redirect("/registar_se")})
                  if(user){

                     const veiculo = await   Veiculo.create({
                        tipo: tipo,
                        marca: marca,
                        modelo: modelo,
                        cor: cor,
                       
                        data_fabrico: data_fabrico,
                        matricula: matricula,
                        servico: servico,
                        lotacao: lotacao,
                        combustivel: combustivel,
                        tipo_caixa: tipo_caixa,
                        distancia_eixo: distancia_eixo,
                        cilindrada: cilindrada,
                        numero_cilindro: numero_cilindro,
                        medidas_pneus: medida_pneumaticos,
                        numero_quadro: numero_quadro,
                        tara: tara,
                        numero_motor: numero_motor,
                        peso: peso,
                        estado: 0,
                        userId: user.id
                     }).catch(err =>{console.log(err)})
   
                     if(veiculo){
                        req.session.dados = undefined;
                        req.flash('certo', "a sua conta foi Criada")
                        res.redirect("/formlogin");
                     }else{
                        const user = await User.destroy({where:{id: user.id}}).catch(err =>{console.log(err)})
                        req.flash('errado', "Ocorreu um problema")
                        res.redirect("/viatura");
                     }
                  
                  }

               }else{req.flash('errado', "Registos presentes")
               res.redirect("/viatura");}
            }
            }else{req.flash('errado', "Registos presentes")
            res.redirect("/viatura");}

        

})
router.post("/user/create", async(req, res) => {
   req.session.dados = undefined;
   const {endereco,name,email,tel,user_name,senha,senha2,sexo,provincia,municipio,nascimento,estado_civil}= req.body;
   
 const img = "unknown.png";
   var estado = 1;
   var role = 0;
   var dat3 = new Date();
   var ano = (dat3.getFullYear())
   var c =nascimento.split("-")
   var a =parseInt(c[0])
   var t = ano-a 

   if (!(endereco ==="" ||name ==="" || email==="" || user_name ==="" || senha === "" || senha2=="" || tel === "" ||sexo=== "" ||provincia ===""|| municipio=== ""|| nascimento===""|| estado_civil==="")) {

      let re = /[A-Z]/;
      const hasUpper = re.test(user_name);
      const verificaEspaco = (user_name) => /\s/g.test(user_name);
      const Mailer = /^[^ ]+@[^ ]+\.[a-z]{2,3}$/.test(email);
      const number = /^[9]{1}[0-9]{8}$/.test(tel)
 if(t > 90){
   req.flash('errado', "Idade Superior");
   res.redirect("/registar_se")
 }else
      if(t < 18){
         req.flash('errado', "Idade inferio aos 18");
         res.redirect("/registar_se")
      }else if (hasUpper === true) {
         req.flash('errado', "nao cadastrado");
         res.redirect("/registar_se")


      } else if (verificaEspaco === true) {
         req.flash('errado', "nao cadastrado");
         res.redirect("/registar_se")

      } else
         if (!Mailer) {
            req.flash('errado', "nao cadastrado");
            res.redirect("/registar_se")
         } else
            if (senha.length < 5) {
               req.flash('errado', "Senha muito fraca");
               res.redirect("/registar_se")
            } else
               if (senha != senha2) {
                  req.flash('errado', "Senha Diferentes");
                  res.redirect("/registar_se")

               } else if(number == false) {
                  req.flash('info', "Numero de Telefone incorreto");
                  res.redirect("/registar_se")
   
               }else{
                  req.session.dados = undefined;
                  const user= await User.findOne({ where: { email: email } }).catch(err =>{console.log(err)})
                  if(!user){
                  const user= await  User.findOne({ where: { tel: tel } }).catch(err =>{console.log(err)})
                   if(!user){
                  const user= await   User.findOne({ where: { user_name: user_name } }).catch(err =>{console.log(err)})
                  if(!user){
                     

                     req.session.dados ={
                        name: name,
                          email: email,
                          tel: tel,
                          user_name: user_name,
                          img: img,
                          senha: senha,
                          provincia: provincia,
                          municipio: municipio,
                          endereco:endereco,
                          sexo:sexo,
                          nascimento:nascimento,
                          estado_civil:estado_civil,
                          estado: estado,
                          role:0

                     }
                    res.redirect("/viatura")
                   //  
               
                  }else{req.flash('info', "Email existenta");
                  res.redirect("/registar_se")}
                   }else{req.flash('info', "Contacto Existenta");
                   res.redirect("/registar_se")}
                  }else{req.flash('info', "User name Existente");
                  res.redirect("/registar_se")}

      
                 
               
               }

   } else {
      console.log("vazio")
      req.flash('errado', "Ocorreu um problema");
      res.redirect("/registar_se")
   }


})
*/

router.get("/formlogin", prev, async (req, res) => {

   res.render("form/login", { errado: req.flash('errado'), certo: req.flash('certo') })

})


router.post("/authenticate", prev, async (req, res) => {
   const {user_name,senha}=req.body;
   
   if (user_name !=undefined|| senha != undefined) {
     const user = await User.findOne({ where: { [Op.or]: [{ email: user_name }, { user_name: user_name }] ,estado:1}}).catch(err =>{console.log(err)})
if(user != undefined){
var correct = bcrypt.compareSync(senha, user.password);
if (correct) {
   var hostname = Os.hostname();
   var tipo = Os.type();
   var plataforma = Os.platform();

   req.session.user = {
      id: user.id,
      email: user.email,
      user_name: user.user_name,
      name:user.name,
      role: user.role,
      sexo:user.sexo,
      endereco:user.endereco,
      estado_civil:user.estado_civil,
      nascimento:user.nascimento,
      provincia:user.provincia,
      municipio:user.municipio
   }
   if (user.role == 0) {

  const reg= await Registo_login.create({ hostname: hostname,tipo: tipo,plataforma: plataforma,estado: 0,userId: req.session.user.id }).catch(err =>{console.log(err);req.flash('errado', " Ocorreu um Problema");res.redirect("/formlogin")})
        
         if(reg){
            res.redirect("/user/index");
         }else{
            req.flash('errado', " Ocorreu um Problema")
            res.redirect("/formlogin")
         }


   } else if (user.role == 1) {
      const reg= await Registo_login.create({ hostname: hostname,tipo: tipo,plataforma: plataforma,estado: 0,userId: req.session.user.id }).catch(err =>{console.log(err);req.flash('errado', " Ocorreu um Problema");res.redirect("/formlogin")})
        
      if(reg){
         res.redirect("/admin/dashboard");
      }else{
         req.flash('errado', " Ocorreu um Problema")
         res.redirect("/formlogin")
      }

   } else if (user.role == 2) {
      const reg= await Registo_login.create({ hostname: hostname,tipo: tipo,plataforma: plataforma,estado: 0,userId: req.session.user.id }).catch(err =>{console.log(err);req.flash('errado', " Ocorreu um Problema");res.redirect("/formlogin")})
        
      if(reg){
         res.redirect("/corretor/index");
      }else{
         req.flash('errado', " Ocorreu um Problema")
         res.redirect("/formlogin")
      }


   }

} else {
   req.flash('errado', " nao cadstrado")
   res.redirect("/formlogin")
}
}else{
   req.flash('errado', "Nenhuma conta associado a este nome")
      res.redirect("/formlogin");
}

   } else {
      req.flash('errado', "nao cadastrado")
      res.redirect("/formlogin");
   }

})
router.get("/user/index", userAuth, async (req, res) => {
   const veiculo = await Veiculo.findAll({ where: { userId: req.session.user.id } }).catch(erro => { console.log(erro) })
const user = await User.findOne({ where: { id: req.session.user.id } }).catch(err =>{ console.log(err)})

res.render("user/perfil", {veiculo,user, certo: req.flash('certo'), info: req.flash('info'), errado: req.flash('errado')})


  

})
router.get("/logout", async (req, res) => {
  req.session.user = undefined;
   res.redirect("/");
})

router.get("/user/add/veiculo", userAuth, async (req, res) => {
   const user = await User.findOne({ where: { id: req.session.user.id } }).catch(err =>{console.log(err)});
   if (user) {
      res.render("user/form/veiculo", { user: user })
   }else{
    res.redirect("/formlogin")
   }

})
//adicionar validação
router.post("/user/adicionar_veiculo/save", userAuth ,async(req, res) => {
   const {id,cor,matricula,peso,modelo,marca,tipo, servico,lotacao, combustivel, tipo_caixa, distancia_eixo, cilindrada, numero_cilindro, medida_pneumaticos, numero_quadro, tara, numero_motor } = req.body;
   console.log(matricula)

   if (!(id ==="" ||matricula===""||modelo===""||marca===""||servico===""||numero_motor===""||numero_quadro===""||medida_pneumaticos==="")) {
      let hasUpper1 = /^[A-Z]{2}[-][0-9]{2}[-][0-9]{2}[-][A-Z]{2}$/.test(matricula) 
    var  n  =/[A-Z][0-9]/.test(numero_quadro)
    var  ci =/[0-9]/.test(cilindrada)
    var  me = /[0-9][A-Z]/.test(medida_pneumaticos)
    var  nmotor = /[A-Z][0-9]/.test(numero_motor)
    if(hasUpper1 ==false||n== false ||ci== false ||me== false||nmotor== false){
       console.log(matricula)
      req.flash("errado","Numero do quadro")
               res.redirect("/user/index") 
 
        }else{
   
   const veiculo = await Veiculo.findOne({ where: { [Op.or]: [{ matricula: matricula }, { numero_motor: numero_motor }] } }).catch(err =>{console.log(err)})
               if(!veiculo){
          const veiculo = await   Veiculo.create({
                     tipo: tipo,
                     marca: marca,
                     modelo: modelo,
                     cor: cor,
              
                   
                     matricula: matricula,
                  servico:servico,
                     lotacao: lotacao,
                     combustivel: combustivel,
                     tipo_caixa: tipo_caixa,
                     distancia_eixo: distancia_eixo,
                     cilindrada: cilindrada,
                     numero_cilindro: numero_cilindro,
                     medidas_pneus: medida_pneumaticos,
                     numero_quadro: numero_quadro,
                     tara: tara,
                     numero_motor: numero_motor,
                     peso: peso,
                     estado: 0,
                     userId: id
                  }).catch(err =>{console.log(err)})

                  if(veiculo){
                     req.flash('certo', " Viatura cadastrado com sucesso")
                     res.redirect("/user/index");
                  }else{
                     req.flash('errado', "Ocorreu um problema")
                     res.redirect("/user/index");
                  }
               }else{req.flash('errado', "Registos presentes")
               res.redirect("/user/index");}
            }
            }else{req.flash('errado', "Registos presentes")
            res.redirect("/user/index");}

})
router.get("/user/veiculo/descricao/:matricula", userAuth, async (req, res) => {
   const matricula = req.params.matricula;
   const user = await User.findOne({ where: { id: req.session.user.id } }).catch(erro => { console.log(erro) })
   const apolice = await Apolice.findOne({ where: { matricula: matricula, [Op.or]: [{ estado: 0 }, { estado: 1 },{ estado: 2 }] }}).catch(erro => { console.log(erro) })
   const veiculo = await Veiculo.findOne({ where: { matricula: matricula }}).catch(erro => { console.log(erro) });

      if (veiculo) {
        
         res.render(`user/veiculo_descricao`, {veiculo, apolice, user });
      } else {
         res.render("error/errors-404")
      }
  


})


router.get("/user/veiculo/update/:id", userAuth, async  (req, res) => {
   const {id} = req.params;
   const veiculo = await Veiculo.findByPk(id).catch(err =>{console.log(err)})
   const user = await User.findOne({where:{id:req.session.user.id}}).catch(err =>{console.log(err)})
   if(veiculo){
      if(user){
         res.render("user/form/veiculo-editar", {veiculo,user })
      }else{req.flash('errado', "Ocorreu um problema");
      res.redirect("/formlogin")}
   }else{
      res.render("error/errors-404")
   }
 

  


})
router.post("/user/update/veiculo",  userAuth, async (req, res) => {
   const {tipo,marca,modelo,data_fabrico,matricula,cor,id}= req.body;
 
 
   if(tipo ===""||marca ==="" ||modelo ===""|| data_fabrico =="" ||matricula ===""|| cor ==="" ||id ===""){
      req.flash("errado","Dados Não atualizado")
       res.redirect("/user/index")
   }else{
     const veiculo = await  Veiculo.update({ tipo: tipo, marca: marca,modelo: modelo,data_fabrico: data_fabrico,matricula: matricula,cor: cor}, { where:{id: id }}).catch(err =>{console.log(err)})   
     if(veiculo){
      req.flash("certo","Dados atualizado")
      res.redirect("/user/index")
     }else{
      req.flash("errado","Dados Não atualizado")
      res.redirect("/user/index")
     }
   }
  
})
//Lista todos os veiculos os meus veiculos

router.get("/user/delete/my_car/:id", userAuth, async (req, res) => {
   const {id}= req.body;
      if (!isNaN(id)) {//se for um numero 
     const veiculo = await Veiculo.destroy({where: {id: id }})
         if(veiculo){
            req.flash('certo', " Eliminado com sucesso")
            res.redirect(`/user/index`);
         }else{
            req.flash('errado', " Aconteceu um problema")
         res.redirect("/user/index");
         }     
      } else {
         req.flash('errado', " Aconteceu um problema")
         res.redirect("/user/index");
      }

 
});
router.post("/user/perfil/update", userAuth,async (req, res) => {
   const {name,email,tel,user_name,provincia,municipio,sexo,estado_civil,endereco,nascimento}= req.body;
   if(name===""||email===""||tel===""||user_name===""||provincia===""||municipio===""||sexo===""||estado_civil===""||endereco===""||nascimento===""){
      req.flash('errado', "Erro ao editar os dados")
      res.redirect("/user/index")
   }else{
      var i = parseInt(tel)
      const user = await User.update
      ({name: name,
         email: email, tel:i, user_name: user_name,
           provincia: provincia, municipio: municipio,endereco:endereco,nascimento:nascimento,estado_civil:estado_civil }, { where: {id: req.session.user.id } }).catch(err =>{console.log(err)})
           if(user){
            req.flash('certo', "Dados atualizado com sucesso")
            res.redirect("/user/index")
           }else{req.flash('errado', "Erro ao editar os dados")
           res.redirect("/user/index")}
   }
})

//Parte de fazer uploadsss
router.get("/user/upload/:id",userAuth, async (req, res) => {
   const {id}= req.params;
 const user = await  User.findByPk(id).catch(err =>{console.log(err)})
 if(user){
   res.render("user/form/upload", {user}) 
 }else{
   res.render("error/errors-404")
 }

})
router.post("/user/upload/save", upload.single("image"), userAuth, async (req, res) => {
   const imagename = req.file.filename;
   const user = await  User.update({ img: imagename }, { where: {id:req.session.user.id}}).catch(err =>{console.log(err)})
   if (user){
      req.flash('certo', "Foto Alterado")
      res.redirect("/user/index")
   }else{
      req.flash('errado', "Ocorreu um problema")
      res.redirect("/user/index")
   }
})
router.get("/user/notificar", userAuth,async (req, res) => {
   const user = await   User.findOne({ where: { id: req.session.user.id } }).catch(err =>{console.log(err)})
  const  veiculo = await Veiculo.findAll({userId:req.session.user.id}).catch(err =>{console.log(err)})
  if(user){
     if(veiculo){
      res.render("user/form/notificar", { user,veiculo, info: req.flash('info'), errado: req.flash('errado') });
     }else{
    req.flash('info', "Não tens Veiculo")
     res.redirect("/user/index");}

  }else{
   res.render("error/errors-404")
  }
})
router.get("/user/notificar/furto", userAuth, async (req, res) => {
   const user  = await  User.findOne({ where: { id: req.session.user.id } }).catch(err =>{console.log(err)})

   if(user){
      const veiculo = await Veiculo.findAll({where:{userId:user.id,estado:0}}).catch(err =>{console.log(err)})
      if(veiculo !=undefined){
         res.render("user/form/furto", { user,veiculo });
      }else{
         req.flash('info', "Viaturas Não encontradas")
         res.redirect("/user/index");
      }
   }else{
      res.render("error/errors-404")
   }
 

})

//Notificar
router.post("/user/notificar/save", userAuth, upload.single("image"), async (req, res) => {
   const {lat,lng,matricula,descricao,id,danos}= req.body;
    const imagename = req.file.filename;
    const estado = 0;
   var data = new Date();
   var mes =(data.getMonth() + 1)


   if (lat ==="" ||lng ==="" || matricula === ""|| descricao===""|| danos ==="" || id=== "") {
      req.flash('errado', "Nao cadstrado")
      res.redirect("/user/notificar"); 
   }else{
      const  apolice = await Apolice.findOne({where:{matricula:matricula,estado:1}}).catch(err =>{console.log(err)})
    
   if ( apolice!= undefined){
      const options = {
         method: 'GET',
         url: 'https://forward-reverse-geocoding.p.rapidapi.com/v1/reverse',
         params: {
           lat: lat,
           lon: lng,
           'accept-language': 'pt-br',
           format: 'json',
           polygon_threshold: '0.0'
         },
         headers: {
           'X-RapidAPI-Host': 'forward-reverse-geocoding.p.rapidapi.com',
           'X-RapidAPI-Key': '5ac2282b82msh7fb7492b138993ap1dfcdejsn23ee68e9795b'
         }
       };

       const dados = await  axios.request(options).catch(err =>{console.log(err)})
       if(dados){
       var c=dados.data.address.county.split(" ")
       var p=dados.data.address.state;
       var municipio=c[2];
       var provincia=p;
       console.log(provincia, municipio);
       const noti = await Notificacao.create({
         descricao: descricao,
         lat: lat,
         lng: lng,
         matricula: matricula,
         img: imagename,
         danos_terceiro: danos,
         provincia: provincia,
         municipio: municipio,
         estado: estado,
         mes:mes,
         userId: id
       }).catch(err =>{console.log(err)})
       if(noti != undefined){
         req.flash('certo', "cadstrado")
        res.redirect("/user/index"); 
       }else{ req.flash('errado', "Não Notificaste")
       res.redirect("/user/index");}
      }else{ req.flash('errado', "opps tenta mas tarde")
      res.redirect("/user/notificar/furto");}
     

   }else{ req.flash('errado', "Prenche os dados Correctamente")
   res.redirect("/user/notificar/furto");}

}      

})
router.post("/user/notificar/furto/save", userAuth, upload.single("documento"), async(req, res) => {
   const {matricula,descricao,lat,lng} = req.body;

   if(matricula ===""|| descricao===""|| lat==="" || lng==="" ||descricao.length < 10){

   }else{

   const documento = req.file.filename;
   const estado = 0;
   const id = req.session.user.id;
   const apolice = await Apolice.findOne({where:{matricula:matricula,estado:1}}).catch(err =>{console.log(err)})
   if(apolice!= undefined){
   if(apolice.tipo_seguro == 3){

   const alert = await Alert_roubo.findOne({where:{matricula:matricula}}).catch(err =>{console.log(err)});
   if(alert == undefined){
      const options = {
         method: 'GET',
         url: 'https://forward-reverse-geocoding.p.rapidapi.com/v1/reverse',
         params: {
           lat: lat,
           lon: lng,
           'accept-language': 'pt-br',
           format: 'json',
           polygon_threshold: '0.0'
         },
         headers: {
           'X-RapidAPI-Host': 'forward-reverse-geocoding.p.rapidapi.com',
           'X-RapidAPI-Key': '5ac2282b82msh7fb7492b138993ap1dfcdejsn23ee68e9795b'
         }
       };
       const dados = await  axios.request(options).catch(err =>{console.log(err); req.flash('errado', "Ocorreu um Problrma")
       res.redirect("/user/index");})
       var c=dados.data.address.county.split(" ")
       var p=dados.data.address.state;
       var municipio=c[2];
       var provincia=p;
       console.log(dados)
       console.log(provincia, municipio);
    const alert = await  Alert_roubo.create({
         descricao: descricao,
         matricula: matricula,
         documento: documento,
         provincia:provincia,
         municipio:municipio,
         estado: estado,
         userId: id
      }).catch(err =>{console.log(err)});
      if(alert  != undefined){
         req.flash('certo', "cadastrado")
         res.redirect("/user/index");
      }else{ req.flash('errado', "Ocorreu um problema")
      res.redirect("/user/index");}
   }else{ req.flash('errado', "Ocorreu um problema")
   res.redirect("/user/index");}
   }else{ req.flash('errado', "Ocorreu um problema")
   res.redirect("/user/index");}

}else{ req.flash('errado', "Ocorreu um problema")
res.redirect("/user/index");}

}

})
router.get("/user/new/apolice/:valor/:matricula", userAuth, async (req, res) => {
   const {valor,matricula} = req.params;
   if (valor == 1) {
      var seguro = "Contra terceiro";
   } else if (valor == 2) {
      var seguro = "Contra terceiro Avacado";
   } else if(valor==3){
      var seguro = "Contra Todos os Riscos";
   }else{
      res.render("error/errors-503")
   }
   const user = await User.findOne({ where: { id: req.session.user.id } }).catch(err =>{console.log(err)})
   const veiculo = await Veiculo.findOne({where:{matricula:matricula,estado:0}}).catch(err =>{console.log(err)});
   if(user != undefined){
      console.log(veiculo)
      if(veiculo !=undefined){
      res.render("user/form/apolice", {valor,seguro,user,veiculo });
     }else{req.flash('errado', "Não tens Viatura Cadastrado")
     res.redirect("/user/index");}
   }else{
      res.render("error/errors-404")
    }
 
    
   
})
router.get("/user/tipo/seguro/:matricula", userAuth, async (req, res) => {
   const {matricula}= req.params;
   const veiculo = Veiculo.findOne({where:{matricula:matricula,estado:0}}).catch(err =>{console.log(err)});
   if(veiculo != undefined){
   const user = await User.findOne({ where: { id: req.session.user.id } }).catch(err =>{console.log(err)});
   if(user != undefined){
      res.render("user/form/tipo_seguro", {user,matricula});
   }else{
      res.render("error/errors-404")
   }
   }else{
      res.render("error/errors-404")
   }
  

})



router.get("/userseguradora/:id", userAuth, async (req, res) => {
   const {id}=req.params;
   const user = await User.findOne({ where: { id: req.session.user.id } }).catch(err =>{console.log(err)})
 const seguradora = await Mypoints.findByPk(id).catch(err =>{console.log(err)})
   if(seguradora){
      res.render("user/seguradora", {user,seguradora});
   }else{
      req.flash('errado', "Algo de errado")
      res.redirect("/user/index");
   }
 
})


//Apolice
router.post("/user/novo/apolice", async (req, res) => {
   const {id,matricula,franquia,plano_desejado,tipo_seguro} = req.body;
   const veiculo = await Veiculo.findOne({where:{matricula:matricula}}).catch(erro => { console.log(erro);  req.flash('errado', "Algo de errado");res.redirect("/user/index"); })
   var dias ;
   var mes ;
   var marc =0;
   var ci= 0;
   var n_cilindro =0
   const MarcasCaras= ["BMW","FERRARI","TOYOTA","LAMBORGUINI"]
   if(tipo_seguro == 3){
      if(veiculo.numero_cilindro > 4){
         n_cilindro = 1000
      }else if(veiculo.cilindrada > 200){
         ci = 1000
      }else if((MarcasCaras.includes(Veiculo.marca))== true){
         marc =1000
      }

   }

   if (plano_desejado == "mensal") {
      dias = 30;
      mes = 2;

   } else if (plano_desejado == "trimestral") {
      dias = 30 * 3;
      mes = 4;
   } else if (plano_desejado == "anual") {
      dias = 365;
      mes = 13;
   } else if (plano_desejado == "simestral") {
      dias = 30 * 6;

      mes = 7;
   }
   //Dias que se passaram verificar o BI do User


   if (!(plano_desejado ==="" || id ==="" || matricula ==="" ||franquia==="")) {
      function geraStringAleatoria(tamanho) {
         var stringAleatoria = '';
         var caracteres = '12A3BC1DE0FG4HI2JKL3MN4OP5QR6ST7UV8WX9Y0Z99';
         for (var i = 0; i < tamanho; i++) {
             stringAleatoria += caracteres.charAt(Math.floor(Math.random() * caracteres.length));
         }
         return stringAleatoria;
     }
      var secret = geraStringAleatoria(16)
      const apolice = await Apolice.findOne({where:{matricula:matricula}}).catch(err =>{console.log(err)})
      if(apolice == undefined || apolice.estado > 1){
         if(franquia== null){
            const apolice = await  Apolice.create({
               plano_desejado: plano_desejado,
               dias: dias,
               matricula: matricula,
               franquia: "Sem franquia",
               tipo_seguro: tipo_seguro,
               dia_inicio: '1000-01-01',
               dia_fim: '1000-01-01',
               secret: secret,
               marca:veiculo.marca,
               estado: 0,
               valor: 0,
               userId: id
   
            }).catch(err =>{console.log(err)})
         }else{
            const apolice = await  Apolice.create({
               plano_desejado: plano_desejado,
               dias: dias,
               matricula: matricula,
               franquia: franquia,
               tipo_seguro: tipo_seguro,
               dia_inicio: '1000-01-01',
               dia_fim: '1000-01-01',
               secret: secret,
               marca:veiculo.marca,
               estado: 0,
               valor: 0,
               userId: id
   
            }).catch(err =>{console.log(err)})
         }
         
       
         var pagar = (1500 * tipo_seguro * mes) +(marc + ci + n_cilindro)
         const getRandomIntegerInclusive = (min, max) =>
            Math.floor(Math.random() * (max - min + 1)) + min
         var data_marcacao = getRandomIntegerInclusive(5, 11);

         const marcacao = await  Marcacoes.create({ secret: secret, quantia_pagar: pagar, data_marcacao: data_marcacao, estado: 0, userId: id }).catch(err =>{console.log(err)})
           
         if(marcacao){
            req.flash('certo', `criado ,tens ${data_marcacao} dias para Efetuar o Pagamento`)
          
            res.redirect("/user/index");
         }else{
            req.flash('errado', "Ocorreu um problema")
           res.redirect("/user/index");
         }
    
      }else{
         req.flash('info', "Viatura Com Apolice ativo")
         res.redirect("/user/index");
      }
   }else{
      req.flash('errado', "Ocorreu um problema")
      res.redirect("/user/index");   
   }
    



})
router.get("/user/cancelar/acordo/:secret", userAuth,async (req, res) => {
   const {secret}= req.params;
   const apolice = await Apolice.findOne({where:{secret:secret}}).catch(err =>{console.log(err)})
  
   if(apolice){
      const apolice = await Apolice.destroy({ where: {  secret: secret }}).catch(err =>{console.log(err)})
      const marcacao = await  Marcacoes.destroy({ where: {  secret: secret }}).catch(err =>{console.log(err)})
      if(apolice && marcacao){
         req.flash('certo', "Cancelado com Sucesso")
         res.redirect("/user/index")
      }else{
         req.flash('errado', "Ocorreu um problema")
      res.redirect("/user/index")
      }

   }else{
      req.flash('errado', "Ocorreu um problema")
      res.redirect("/user/index")
   }
   
 

})
router.get("/user/renovar/acordo/:secret", userAuth, (req, res) => {
   var secret = req.params.secret;
   Apolice.upload({ estado: 3 }, {
      where: {
         secret: secret
      }
   }).then(() => {
      res.redirect("/user/tipo/seguro")
   })

})
router.get("/user/pagamentos", userAuth, (req, res) => {

   Marcacoes.findAll({

      where: {
         userId: req.session.user.id,
         estado: 0

      },
      include: [{ model: User }]

   }).then(result => {
      User.findOne({
         where: {
            id: req.session.user.id
         }
      }).then(user => {
         res.render("user/marcacao", { result: result, user: user })
      }).catch(err => {
         req.flash('errado', "Erro na execução")
         res.redirect("/formlogin");
      })


   }).catch(err => {
      req.flash('errado', "Erro na execução")
      res.redirect("/user/pagamentos");
   })





})

router.get("/user/mapa", userAuth, (req, res) => {


   Mypoints.findAll({where:{entidade:0}}).then(dados => {
      User.findOne({ where: { id: req.session.user.id } }).then(user => {

         res.render("user/mapa", { user: user, dados: dados })

      })
   })

})
/*PDF apolice   ejs.renderFile("./views/user/pdf_apolice.ejs",{apolice:apolice},(erro, html) => {
         if(erro){
            console.log(erro)
         }else{
          pdf.create(html,{}).toFile('public/docs/'+ nome,(err,res)=>{
               if(err){
                  console.log("Aconteceu um erro")
               }else{
                 console.log(res)
               }
            })
         }
      });
      var baixar = '/docs/' + nome;
      
    res.render("user/descarregar", { baixar })

     if(erro){
                     console.log(erro)
                  }else{
                   pdf.create(html,{}).toFile('public/docs/'+ nome2,(err,res)=>{
                        if(err){
                           console.log("Aconteceu um erro")
                        }else{
                          console.log(res)
                        }
                     })
                  }

                  var baixar = '/docs/' + nome2;
               res.render("user/descarregar", { baixar })
 */
router.get("/user/apolice/pdf/:id", async (req, res) => {
   const {id}= req.params
 const apolice = await Apolice.findOne({ where: { id: id },
      include: [{ model: User }]}).catch(err =>{console.log(err)})
      if(apolice){
  const veiculo = await Veiculo.findOne({where:{matricula:apolice.matricula}}).catch(err =>{console.log(err)})
  if(veiculo){
   const url = `http://localhost:3000/user/apolice/pdf/checar/${id}`;//criar uma rota de visualização do QR code (esta routa que esta aqui...)
         Qr.toDataURL(url, (erro, src) => {
            if (erro) {
               res.render("error/errors-404")
            } else {
               res.render("user/PDF/pdf_apolice", {veiculo,  apolice,src })
            

            }

         })
  }else{
   res.render("error/errors-404")
  }
      }else{
           res.render("error/errors-404")
      }
});
router.get("/user/apolice/pdf/checar/:id", async (req, res) => {
   const {id}= req.params
 const apolice = await Apolice.findOne({ where: { id: id },
      include: [{ model: User }]}).catch(err =>{console.log(err)})
      if(apolice){
  const veiculo = await Veiculo.findOne({where:{matricula:apolice.matricula}}).catch(err =>{console.log(err)})
  if(veiculo){
   const url = `/user/apolice/pdf/checar/${id}`;//criar uma rota de visualização do QR code (esta routa que esta aqui...)
         Qr.toDataURL(url, (erro, src) => {
            if (erro) {
               res.render("error/errors-404")
            } else {
               res.render("user/PDF/apolice", {veiculo,  apolice,src })
            

            }

         })
  }else{
   res.render("error/errors-404")
  }
      }else{
           res.render("error/errors-404")
      }
});

//comprovante
router.get("/user/comprovante/pdf/:id", (req, res) => {
   var id = req.params.id;
   Apolice.findOne({
      where: { id: id },
      include: [{ model: User }]
   }).then(apolice => {
      if (apolice) {
         const url = `http://localhost:3000/user/comprovante/pdf/checar/${id}`;
         Qr.toDataURL(url, (erro, src) => {
            if (erro) {
               res.render("error/errors-404")
            } else {
               res.render("user/PDF/pdf_comprovante", { src, apolice: apolice })

            }

         })
      } else {
         res.render("error/errors-404")
      }


   })




});
//ao scannear o codigo QR
router.get("/user/comprovante/pdf/checar/:id", async (req, res) => {
   var {id} = req.params;
 const apolice = await  Apolice.findOne({
      where: { id: id },
      include: [{ model: User }]
   }).catch(err =>{console.log(err)})
      if (apolice) {
     const veiculo = await    Veiculo.findOne({
            where: {
               matricula: apolice.matricula
            }
         }).catch(err =>{console.log(err)})
         if(veiculo){
            res.render("checar", { veiculo: veiculo, apolice: apolice })
         }else{
            res.render("error/errors-404")
         }
         
        
      } else {
         res.render("error/errors-404")
      }

 



});
















//router perfil Admin 
router.get("/admin/dashboard",adminAuth,async(req, res) => {
   const user = await User.findAll({where:{role:0}}).catch(erro =>{console.log(erro)})
   const veiculo = await Veiculo.findAll({}).catch(erro =>{console.log(erro)})
   const tipo1 = await Apolice.findAll({where:{tipo_seguro:1}}).catch(erro =>{console.log(erro)})
   const tipo3 = await Apolice.findAll({where:{tipo_seguro:3}}).catch(erro =>{console.log(erro)})
   const notificacao = await Notificacao.findAll({where:{estado:0}}).catch(erro =>{console.log(erro)})
   const contactos = await Contactos.findAll({where:{estado:0}}).catch(erro =>{console.log(erro)})
   const relatorio_s = await Relatorio_sinistralidade.findAll({where:{estado:0}}).catch(erro =>{console.log(erro)})
   const admin = await User.findOne({ where: { id: req.session.user.id } }).catch(erro =>{console.log(erro)})
   const app = await Apolice.findAll({ where:{estado:1}, attributes: ["marca", [Sequelize.fn('count', Sequelize.col('marca')), 'marcacount']], group: "marca", order: ["marca"] }).catch(erro => { console.log(erro) })
       // renderizar isso no front para saber qmarcas de carro com apolice
       const ponto = await Mypoints.findAll({}).catch(erro =>{console.log(erro)})
       const inscrito = await Inscritos.findAll({}).catch(erro =>{console.log(erro)})
   
       const notificados = await Notificacao.findAll({limite:5, order: [[`id`, `DESC`]]}).catch(erro =>{console.log(erro)})
       console.log(notificados)
  
  

    
     const noti = await Notificacao.findAll({ 
      attributes:["mes",[Sequelize.fn('count',Sequelize.col('mes')),'mescount']] ,
      group:"mes",
      order:["mes"],
      where:{
         estado:1
      }
     
   }).catch(erro =>{ console.log(erro) })
   

   const  notify = await Notificacao.findAll({ 
      attributes:["mes",[Sequelize.fn('count',Sequelize.col('mes')),'mescount']] ,
      group:"mes",
      order:["mes"]
   }).catch(erro =>{ console.log(erro) })
   

   var notify2 = notify.map(element =>{
      var r =noti.map(e=> (e.dataValues.mes==element.dataValues.mes)?e.dataValues.mescount:0);
      console.log(r)
      const v=r.map(r=>parseInt(r.toString())).reduce((prev, curr) => prev + curr, 0)
      var m=element.dataValues.mes;
      var mes;
      switch (m) {
         case 1:
            mes="Janeiro"
            break;
            case 2:
            mes="Fevereiro"
            break;
            case 3:
            mes="Março"
            break;
            case 4:
            mes="Abril"
            break;
            case 5:
            mes="Maio"
            break;
            case 6:
            mes="Junho"
            break;
            case 7:
            mes="Julho"
            break;
      
         default:
            break;
      }
      return{resolvido:v, naoresolvido:(element.dataValues.mescount-v),total:element.dataValues.mescount, mes:mes}



   })
   const meses =["Janeiro","Fevereiro","Março","Abril","Maio","Junho","Julho","Agosto","Setembro","Outubro","Novembro","Dezembro"]
  var meses2 = meses.map( element =>{
     var m3 = notify2.filter(e=>e.mes==element)
     if(m3 == 0){
        return { resolvido:0,naoresolvido:0,total:0,mes:element}
     }else{
      return m3[0]
     }
   })
   const app2 = app.map(e =>{
      return{marca:e.dataValues.marca,marcacount:e.dataValues.marcacount}

   })
  
   const Marcas =["GM/CHEVROLET","CHANGAN","BUGATTI","BENTLEY","ASTON MARTIN","AGRALE","TOYOTA","BMW","NISSAN","FERRARI"]
   var marca = Marcas.map( element =>{
      var m3 = app2.filter(e=>e.marca==element)
      if(m3 == 0){
         return {marca:element, marcacount:0}
      }else{
       return m3[0]
      }
    })
  
  console.log(app2)
           res.render("admin/dashboard", {ponto,inscrito,notificados,meses2,marca,contactos,user,veiculo,tipo1,tipo3,notificacao,relatorio_s,admin,certo: req.flash('certo'), errado: req.flash('errado')})
            
     

   
   




})
// Router perfil Mecanico
router.get("/corretor/index", corretorAuth, async (req, res) => {
   const user = await User.findOne({ where: { id: req.session.user.id } }).catch(erro =>{ console.log(erro)})
   const local = await Local.findAll({where:{userId:req.session.user.id},raw:true}).catch(err =>{console.log(err)})
  var notificacao =[];
 
 
 if(local.length == 4){
    const a =local[0].municipio;
    const b =local[1].municipio;
    const c =local[2].municipio;
    const d =local[3].municipio;
    notificacao = await Notificacao.findAll({where:{[Op.or]: [{ municipio:a},{ municipio:b},{ municipio:c},{ municipio:d}],estado:0  },raw:true}).catch(err =>{console.log(err)})
 
 }else if(local.length == 3){
    const a =local[0].municipio;
    const b =local[1].municipio;
    const c =local[2].municipio;
   
      notificacao = await Notificacao.findAll({where:{[Op.or]: [{ municipio:a},{ municipio:b},{ municipio:c}],estado:0  },raw:true}).catch(err =>{console.log(err)})
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
 
 
   res.render("corretor/perfil", {local, notificacao, user, info: req.flash('info'), certo: req.flash('certo'), errado: req.flash('errado') })
    
     

  
})


module.exports = router;