const express = require(`express`)
const router = express.Router();
const User = require(`../models/User`);
const Veiculo = require(`../models/Veiculo`)
const Notificacao = require(`../models/Notificacao`)
const bcrypt = require(`bcryptjs`);
const userAuth = require(`../middlewares/adminAuth`)
const Contactos = require(`../models/Contactos`)
const Mypoints = require(`../models/Mypoints`);
const res = require(`express/lib/response`);
const upload = require(`../middlewares/upload`);
const axios = require(`axios`);
const cors = require("cors")
const Comprovativo = require('../models/Comprovativo');
const Local = require(`../models/Local`);
const Apolice = require(`../models/Apolice`)
const Marcacoes = require(`../models/Marcacoes`);
const Registo_login = require(`../models/Registo_login`);
const Alert_roubo = require(`../models/alertar-roubo`)
const Op = require(`sequelize`).Op;
const Relatorio_sinistralidade = require("../models/Relatorio_sinistralidade");
const RankNotificacoes = require("../models/RankNotificacao")
const Inscrito = require("../models/Inscritos");
const Qr = require('qrcode')
const Fundos = require("../models/Fundos")
const sid='AC2c54f2430b2e585129a58d6e4c911ac2';

const auth_token='27d76bf7c614e1717d642db8f2104f4a'
const twilio = require('twilio')(sid, auth_token);

const { Sequelize } = require("sequelize");




router.post("/relatorioMensais" ,userAuth, async(req, res) =>{
   const {inicio,fim}= req.body;
   if(fim > inicio){
   const notificacao = await Notificacao.findAll({where:{ createdAt:{
      [Op.between]:[new Date(inicio) ,new Date(fim)]
   }},include: [{ model: User }]}).catch(erro => { console.log(erro) })
   const contactos = await Contactos.findAll({where:{ createdAt:{
      [Op.between]:[new Date(inicio) ,new Date(fim)]
   }}}).catch(erro => { console.log(erro) })
   const clientes = await User.findAll({where:{ role:0, createdAt:{
      [Op.between]:[new Date(inicio) ,new Date(fim)]
   }}}).catch(erro =>{console.log(erro)})
      const inscritos = await Inscrito.findAll({where:{createdAt:{
      [Op.between]:[new Date(inicio) ,new Date(fim)]
   }}}).catch(erro =>{console.log(erro)})
   const apolice = await Apolice.findAll({where:{ createdAt:{
      [Op.between]:[new Date(inicio) ,new Date(fim)]
   }},include: [{ model: User }]}).catch(erro =>{console.log(erro)})
   const roubo = await Alert_roubo.findAll({where:{ createdAt:{
      [Op.between]:[new Date(inicio) ,new Date(fim)]
   }},include: [{ model: User }]}).catch(erro =>{console.log(erro)})
   const pontos = await Mypoints.findAll({where:{  createdAt:{
      [Op.between]:[new Date(inicio) ,new Date(fim)]
   }}}).catch(erro =>{console.log(erro)})
  
   res.render("admin/PDF/relatorioMensais",{notificacao,contactos,clientes,apolice,inscritos,roubo,pontos})
}else{
   req.flash("info","Datas Incorretas")
   res.redirect("/admin/relatoriosistema")
}
 })
 
router.get("/relatorioGeral" ,userAuth, async(req, res) =>{
   const notificacao = await Notificacao.findAll().catch(erro => { console.log(erro) })
   const contactos = await Contactos.findAll().catch(erro => { console.log(erro) })
   const clientes = await User.findAll().catch(erro =>{console.log(erro)})
      const inscritos = await Inscrito.findAll().catch(erro =>{console.log(erro)})
   const apolice = await Apolice.findAll().catch(erro =>{console.log(erro)})
   const roubo = await Alert_roubo.findAll().catch(erro =>{console.log(erro)})
   const pontos = await Mypoints.findAll().catch(erro =>{console.log(erro)})
   const veiculos = await Veiculo.findAll().catch(erro =>{console.log(erro)})
   res.render("admin/PDF/relatoriorege",{notificacao,contactos,clientes,inscritos,apolice,roubo,pontos,veiculos})

 })
router.get("/funcionario" ,userAuth, async(req, res) =>{
   const notificacao = await Notificacao.findAll({ where: { estado: 0 } }).catch(erro => { console.log(erro) })
   const contactos = await Contactos.findAll({ where: { estado: 0 } }).catch(erro => { console.log(erro) })
   const relatorio_s = await Relatorio_sinistralidade.findAll({ where: { estado: 0 } }).catch(erro => { console.log(erro) })
   const admin = await User.findOne({ where: { id: req.session.user.id } }).catch(erro => { console.log(erro) })
   const users = await User.findAll({where:{role:2}}).catch(erro =>{console.log(erro)})
   const u = await Relatorio_sinistralidade.findAll({attributes:["userId",[Sequelize.fn('count',Sequelize.col('userId')),'idcount']] , order:["userId"],include:[{model:User,where:{role:2}}]}).catch(erro =>{console.log(erro)})
   const w = u.map(element =>{
      const ur = users.map(e=>(e.dataValues.userId==element.dataValues.userId)?e.dataValues.idcount:0)
      console.log(ur)
  })
  const q = u.map(element =>{
   const w =  users.map(e =>{
      if(element.dataValues.userId ==e.id){
         return {id:e.id,email:e.email,name:e.name,img:e.img,provincia:e.provincia,sexo:e.sexo,municipio:e.municipio,valor:element.dataValues.idcount}
      }else{
         return {id:e.id,email:e.email,name:e.name,img:e.img,provincia:e.provincia,sexo:e.sexo,municipio:e.municipio,valor:0}
      }
     })
   
    
     res.render("admin/funcionario",{w,contactos,notificacao,relatorio_s,admin,certo: req.flash('certo'), errado: req.flash('errado')})
      
  })
})

router.post("/admin/funcionario" ,userAuth, async(req, res)=>{
   const {id,inicio,fim}= req.body
   const  roubo = await Relatorio_sinistralidade.findAll({ 
      where:{
         userId:id,
         
         createdAt:{
            [Op.between]:[new Date(inicio) ,new Date(fim)]
         }
      },
    include:[
       {
          model:User,
         
       }
    ]
   }).catch(erro =>{ console.log(erro) })
   
   console.log(roubo)
   res.render("admin/PDF/corretor_relatorio",{roubo,id})
}) 



router.get(`/admin/consultar/fipe`, userAuth, async (req, res) => {

   const notificacao = await Notificacao.findAll({ where: { estado: 0 } }).catch(erro => { console.log(erro) })
   const contactos = await Contactos.findAll({ where: { estado: 0 } }).catch(erro => { console.log(erro) })
   const relatorio_s = await Relatorio_sinistralidade.findAll({ where: { estado: 0 } }).catch(erro => { console.log(erro) })
   const admin = await User.findOne({ where: { id: req.session.user.id } }).catch(erro => { console.log(erro) })
   res.render(`admin/fipe`, { contactos, admin, notificacao, relatorio_s });

});
router.get(`/cliente-veiculos`, userAuth, async (req, res) => {

   const notificacao = await Notificacao.findAll({ where: { estado: 0 } }).catch(erro => { console.log(erro) })
   const contactos = await Contactos.findAll({ where: { estado: 0 } }).catch(erro => { console.log(erro) })
   const relatorio_s = await Relatorio_sinistralidade.findAll({ where: { estado: 0 } }).catch(erro => { console.log(erro) })
   const admin = await User.findOne({ where: { id: req.session.user.id } }).catch(erro => { console.log(erro) })
   const veiculo = await Veiculo.findAll({ include: [{ model: User }] }).catch(erro => { console.log(erro) })
   res.render(`admin/cliente-veiculos`, { contactos, admin, notificacao, relatorio_s ,veiculo,certo: req.flash('certo'), errado: req.flash('errado')});

});
router.get(`/cliente-apolice`, userAuth, async (req, res) => {

   const notificacao = await Notificacao.findAll({ where: { estado: 0 } }).catch(erro => { console.log(erro) })
   const contactos = await Contactos.findAll({ where: { estado: 0 } }).catch(erro => { console.log(erro) })
   const relatorio_s = await Relatorio_sinistralidade.findAll({ where: { estado: 0 } }).catch(erro => { console.log(erro) })
   const admin = await User.findOne({ where: { id: req.session.user.id } }).catch(erro => { console.log(erro) })
   const apolice = await Apolice.findAll({ include: [{ model: User }]}).catch(erro => { console.log(erro) })
console.log(apolice)
      res.render(`admin/cliente-apolice`, {apolice, contactos, admin, notificacao, relatorio_s,certo: req.flash('certo'), errado: req.flash('errado')});
 
  

});
router.get("/deletarapolice/:id", userAuth, async(req,res) =>{
   const{id}= req.params;
   const apolice = await Apolice.destroy({where:{id:id}}).catch(erro => { console.log(erro) })
   if(apolice){
      req.flash("certo","Apolice Deletado")
      res.redirect(`/cliente-apolice`)
   }else{
      req.flash("errado","Ocorreu um problema")
      res.redirect(`/cliente-apolice`) 
   }

})
router.get(`/deletar/local/:id`, userAuth, async (req, res) => {
   const {id} = req.params;
   const local = await Local.findByPk(id).catch(erro => { console.log(erro) })
 
   if(local){
      const delet = await Local.destroy({where:{id:id}}).catch(erro => { console.log(erro) })
      if(delet){
         req.flash("certo","Local Deletado")
    
         res.redirect(`/admin/user/detalhes/${local.userId}`)
      }else{
         req.flash("errado","Ocorreu um problema")
         res.redirect(`/admin/user/detalhes/${local.userId}`)
      }
   }else{
res.render("error/errors-404")
   }

});

router.post(`/localatuacao`, userAuth, async (req, res) => {
   const {provincia,municipio,id}= req.body;
   if(provincia ==="" || municipio==="" || id===""){
      req.flash("errado","Ocorreu um problema")
      res.redirect(`/admin/user/detalhes/${id}`)
   }else{
      const local1 = await Local.findAll({where:{municipio:municipio}}).catch(erro => { console.log(erro) })
      if(local1.length > 9){
         cosole.log(local1)
        req.flash("errado","Antingiu o limite de Corretor nesta área")
        res.redirect(`/admin/user/detalhes/${id}`)
      }else{
      const local = await Local.findAll({where:{municipio:municipio,userId:id}}).catch(erro => { console.log(erro) })
  if(local.length > 0 ){
     console.log(local)
   req.flash("errado","Ja estas nesta Área")
  res.redirect(`/admin/user/detalhes/${id}`)
  }else{
     const l = await Local.findAll({where:{userId:id}}).catch(erro => { console.log(erro) })
     if(l.length > 3){
      req.flash("errado","Antigiu Limite de relacionamento")
     res.redirect(`/admin/user/detalhes/${id}`)
     }else{
     const local_c = await Local.create({provincia:provincia,municipio:municipio,userId:id}).catch(erro => { console.log(erro) })
     if(local_c){
    req.flash("certo","Novo Local Adicionado")
      res.redirect(`/admin/user/detalhes/${id}`)
     }else{
      req.flash("errado","Antigiu Limite de relacionamento")
     res.redirect(`/admin/user/detalhes/${id}`)
     }
   }

   
  }
}
}
});
router.get(`/admin/rotas/:id`, userAuth, async (req, res) => {
   const {id}= req.params;

   const notificacao = await Notificacao.findAll({ where: { estado: 0 } }).catch(erro => { console.log(erro) })
   const contactos = await Contactos.findAll({ where: { estado: 0 } }).catch(erro => { console.log(erro) })
   const relatorio_s = await Relatorio_sinistralidade.findAll({ where: { estado: 0 } }).catch(erro => { console.log(erro) })
   const admin = await User.findOne({ where: { id: req.session.user.id } }).catch(erro => { console.log(erro) })
   const notify = await Notificacao.findByPk(id).catch(erro => { console.log(erro) })
   if(notify){
      res.render(`admin/rotas`, { contactos, admin, notificacao, relatorio_s,notify,certo: req.flash('certo'), errado: req.flash('errado') });
   }else{
      res.render("error/errors-404")
   }
  

});




router.get(`/admin/seguro/relatorio`, userAuth, async (req, res) => {

   const notificacao = await Notificacao.findAll({ where: { estado: 0 } }).catch(erro => { console.log(erro) })
   const contactos = await Contactos.findAll({ where: { estado: 0 } }).catch(erro => { console.log(erro) })
   const relatorio_s = await Relatorio_sinistralidade.findAll({ where: { estado: 0 } }).catch(erro => { console.log(erro) })
   const admin = await User.findOne({ where: { id: req.session.user.id } }).catch(erro => { console.log(erro) })
   res.render(`admin/relatorioSeguro`, { contactos, admin, notificacao, relatorio_s });

});
router.get(`/admin/notificacao/relatorio`, userAuth, async (req, res) => {

   const notificacao = await Notificacao.findAll({ where: { estado: 0 } }).catch(erro => { console.log(erro) })
   const contactos = await Contactos.findAll({ where: { estado: 0 } }).catch(erro => { console.log(erro) })
   const relatorio_s = await Relatorio_sinistralidade.findAll({ where: { estado: 0 } }).catch(erro => { console.log(erro) })
   const admin = await User.findOne({ where: { id: req.session.user.id } }).catch(erro => { console.log(erro) })
   res.render(`admin/relatorioNotificacao`, { contactos, admin, notificacao, relatorio_s });

});
router.get(`/admin/relatoriosistema`, userAuth, async (req, res) => {

   const notificacao = await Notificacao.findAll({ where: { estado: 0 } }).catch(erro => { console.log(erro) })
   const contactos = await Contactos.findAll({ where: { estado: 0 } }).catch(erro => { console.log(erro) })
   const relatorio_s = await Relatorio_sinistralidade.findAll({ where: { estado: 0 } }).catch(erro => { console.log(erro) })
   const admin = await User.findOne({ where: { id: req.session.user.id } }).catch(erro => { console.log(erro) })
   res.render(`admin/relatoriosistema`, { contactos, admin, notificacao, relatorio_s });

});

router.get(`/admin/index`, userAuth, async (req, res) => {
   const notificacao = await Notificacao.findAll({ where: { estado: 0 } }).catch(erro => { console.log(erro) })
   const contactos = await Contactos.findAll({ where: { estado: 0 } }).catch(erro => { console.log(erro) })
   const relatorio_s = await Relatorio_sinistralidade.findAll({ where: { estado: 0 } }).catch(erro => { console.log(erro) })
   const admin = await User.findOne({ where: { id: req.session.user.id } }).catch(erro => { console.log(erro) })
   res.render(`admin/perfil`, { contactos, admin, certo: req.flash('certo'), errado: req.flash('errado'), notificacao, relatorio_s })

});

router.get(`/admin/Listar/user`, userAuth, async (req, res) => {
   const notificacao = await Notificacao.findAll({ where: { estado: 0 } }).catch(erro => { console.log(erro) })
   const contactos = await Contactos.findAll({ where: { estado: 0 } }).catch(erro => { console.log(erro) })
   const relatorio_s = await Relatorio_sinistralidade.findAll({ where: { estado: 0 } }).catch(erro => { console.log(erro) })
   const admin = await User.findOne({ where: { id: req.session.user.id } }).catch(erro => { console.log(erro) })
   const users = await User.findAll({ where: { role:0 }}).catch(erro => { console.log(erro) })
   res.render(`admin/users`, { contactos, users, admin, certo: req.flash('certo'), errado: req.flash('errado'), notificacao, relatorio_s });



});

router.get(`/admin/veiculo/apolice/:matricula`, userAuth, async (req, res) => {
   const {matricula }= req.params;
   const notificacao = await Notificacao.findAll({ where: { estado: 0 } }).catch(erro => { console.log(erro) })
   const contactos = await Contactos.findAll({ where: { estado: 0 } }).catch(erro => { console.log(erro) })
   const relatorio_s = await Relatorio_sinistralidade.findAll({ where: { estado: 0 } }).catch(erro => { console.log(erro) })
   const admin = await User.findOne({ where: { id: req.session.user.id } }).catch(erro => { console.log(erro) })
   const apolice = await Apolice.findOne({ where: { matricula: matricula,estado:1  }}).catch(erro => { console.log(erro) })
   const veiculo = await Veiculo.findOne({ where: { matricula: matricula }, include: [{ model: User }] }).catch(erro => { console.log(erro) });
   const noti = await Notificacao.findAll({ where: { matricula: matricula }, attributes: ["mes", [Sequelize.fn('count', Sequelize.col('mes')), 'mescount']], group: "mes", order: ["mes"]}).catch(erro => { console.log(erro) })
   const noti22 = await Notificacao.findAll({ where: { matricula: matricula } }).catch(erro => { console.log(erro) })
    
   console.log(noti)
const noti2 = noti.map(element => {
   var m = element.dataValues.mes;
   var mes;
   switch (m) {
      case 1:
         mes = "Janeiro"
         break;
      case 2:
         mes = "Fevereiro"
         break;
      case 3:
         mes = "Março"
         break;
      case 4:
         mes = "Abril"
         break;
      case 5:
         mes = "Maio"
         break;
      case 6:
         mes = "Junho"
         break;
      case 7:
         mes = "Julho"
         break;
      case 8:
         mes = "Agosto"
         break;
      case 9:
         mes = "Setembro"
         break;
      case 10:
         mes = "Outubro"
         break;
      case 11:
         mes = "Novembro"
         break;
      case 12:
         mes = "Dezembro"
         break;

      default:
         break;
   }
   return { mes: mes, dados: element.dataValues.mescount }

})
const meses = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"]
 var noti3 = meses.map(element => {
         var m3 = noti2.filter(e => e.mes == element)
         if (m3 == 0) {
            return { mes: element, dados: 0 }
         } else {
            return m3[0]
         }
      });
   
   
      if (veiculo) {
         console.log(noti3)
         res.render(`admin/veiculo_descricao`, {noti3 ,noti22, veiculo, contactos, apolice, admin, notificacao, relatorio_s });
      } else {
         res.render("error/errors-404")
      }
  





});

router.get(`/admin/comprovativo/:id`, userAuth, async (req, res) => {
   const {id}= req.params;
   const notificacao = await Notificacao.findAll({ where: { estado: 0 } }).catch(erro => { console.log(erro) })
   const contactos = await Contactos.findAll({ where: { estado: 0 } }).catch(erro => { console.log(erro) })
   const relatorio_s = await Relatorio_sinistralidade.findAll({ where: { estado: 0 } }).catch(erro => { console.log(erro) })
   const admin = await User.findOne({ where: { id: req.session.user.id } }).catch(erro => { console.log(erro) })
   const comprovativo = await Comprovativo.findOne({ where: {id:id }, include: [{ model: Marcacoes }] }).catch(erro => { console.log(erro) })
   const user =comprovativo.marcaco.userId;
   console.log(user)
const assegurado =  await User.findByPk(user).catch(erro => { console.log(erro) })

  res.render(`admin/comprovativo1`, { contactos, notificacao, relatorio_s,assegurado, comprovativo, admin, certo: req.flash('certo'), errado: req.flash('errado') })

})


//Listar pagamentos nao realizados
router.get(`/admin/Listar/pagamentos`, userAuth, async (req, res) => {
   const notificacao = await Notificacao.findAll({ where: { estado: 0 } }).catch(erro => { console.log(erro) })
   const contactos = await Contactos.findAll({ where: { estado: 0 } }).catch(erro => { console.log(erro) })
   const relatorio_s = await Relatorio_sinistralidade.findAll({ where: { estado: 0 } }).catch(erro => { console.log(erro) })
   const admin = await User.findOne({ where: { id: req.session.user.id } }).catch(erro => { console.log(erro) })
   const comprovativo = await Comprovativo.findAll({ where: { estado: 0 }, include: [{ model: Marcacoes }] }).catch(erro => { console.log(erro) })

   res.render(`admin/comprovativo`, { contactos, notificacao, relatorio_s, comprovativo, admin, certo: req.flash('certo'), errado: req.flash('errado') })

})
//Pagando
router.get(`/admin/pagar/beneficios/:id`, userAuth, async (req, res) => {
   var id = req.params.id;
   const comprovativo = await Comprovativo.findOne({ where: { id: id }, include: [{ model: Marcacoes }] }).catch(erro => { console.log(erro) })
  console.log(comprovativo)
   const comprovativoupdate = await Comprovativo.update({ estado: 1 }, { where: {id:id} }).catch(erro => { console.log(erro) })

   if (comprovativo) {
      const user = await User.findOne({ where:{id:comprovativo.marcaco.userId}})
      const message = ` Sr. ${user.name} a sua apolice  Nº ${comprovativo.marcaco.secret } encontra-se ja disponivel`;
      const number = user.tel; 
   const apolice = await Apolice.findOne({ where: { secret: comprovativo.marcaco.secret } }).catch(erro => { console.log(erro) })
      var data = new Date();
      var dia = String(data.getDate()).padStart(2, '0')
      var mes = String(data.getMonth() + 1).padStart(2, '0')
      var ano = String(data.getFullYear()).padStart(2, '0')
      var dataAtual = ano + '-' + mes + '-' + dia
      function addDias(data, dias) {
         var res = new Date(data);
         res.setDate(res.getDate() + 1 + dias);
         return res
      }
      var tmpDate = new Date(ano, mes - 1, dia)
      var t = (addDias(tmpDate, apolice.dias));
      var b = t.toISOString();
      var inicio = b.split("T")
      var c = (inicio[0]);
      const apoliceupload = await Apolice.update({ estado: 1, dia_inicio: dataAtual, dia_fim: c, valor:comprovativo.marcaco.quantia_pagar }, { where: { id: apolice.id } }).catch(erro => { console.log(erro) })


      if (apoliceupload) {
         const Mensagen = await twilio.messages.create({
            from: '+19706155674',
            to: `+244${number}`,
            body: message
         }).catch(err =>{console.log(err)})
         if(Mensagen){
            req.flash('certo', "Ativo com sucesso")
            res.redirect(`/admin/Listar/pagamentos`);
         }else{
            req.flash('errado', " Algo deu errado")
            res.redirect(`/admin/Listar/pagamentos`); 
         }
    
      } else {
        
      }
   } else {
      res.render("error/errors-404")
   }
})

router.post("/admin/modificar/fundos", userAuth, async (req, res) => {
   const { id, valor } = req.body
   if (!isNaN(valor)) {
      const fundo = await Fundos.findOne({ where: { userId: id } }).catch(erro => { console.log(erro) })
      var novoSaldo = (fundo.saldo - valor);

      const fundoupdate = await Fundos.update({ saldo: novoSaldo }, { where: { userId: id } }).catch(erro => { console.log(erro) })
      if (fundoupdate) {
         req.flash("certo", "Maravilha")
         res.redirect(`/admin/user/detalhes/${id}`)
      } else {
         req.flash("errado", "Ocorreu um problema")
         res.redirect(`/admin/user/detalhes/${id}`)
      }


   } else {
      req.flash("errado", "Ocorreu um problema")
      res.redirect(`/admin/user/detalhes/${id}`)
   }


})




router.post(`/admin/perfil/update`, userAuth, async (req, res) => {
   const { name, email, tel, user_name, provincia, municipio } = req.body;

   const update = await User.update({ name: name, email: email, tel: tel, user_name: user_name, provincia: provincia, municipio: municipio }, { where: { id: req.session.user.id } }).catch(err => {
      console.log(err); req.flash('errado', " Erro ao atualizar os dados")
      res.redirect("/admin/index")
   })
   if (update) {
      req.flash('certo', " Dados atualizado com sucesso!")
      res.redirect(`/admin/index`)

   } else {
      req.flash('errado', " Erro ao atualizar os dados")
      res.redirect("/admin/index")
   }

})
// editar user 
router.get(`/admin/users/edit/:id`, userAuth, async (req, res) => {
   const notificacao = await Notificacao.findAll({ where: { estado: 0 } }).catch(erro => { console.log(erro) })
   const contactos = await Contactos.findAll({ where: { estado: 0 } }).catch(erro => { console.log(erro) })
   const relatorio_s = await Relatorio_sinistralidade.findAll({ where: { estado: 0 } }).catch(erro => { console.log(erro) })
   const admin = await User.findOne({ where: { id: req.session.user.id } }).catch(erro => { console.log(erro) })
   var id = req.params.id;

   const user = await User.findByPk(id).catch(erro => { console.log(erro) })

   res.render(`admin/form/users`, { contactos, user, admin, notificacao, relatorio_s })


});
router.post(`/admin/users/update`, userAuth, async (req, res) => {
   const { name, email, tel, user_name, provincia, municipio, role, id } = req.body;
   const user = await User.update({ name: name, email: email, tel: tel, user_name: user_name, provincia: provincia, municipio: municipio, role: role }, { where: { id: id } }).catch(erro => { console.log(erro) })
   if (user) {
      req.flash('certo', " Dados atualizados com sucesso")
      res.redirect(`/admin/Listar/user`);
   } else {
      req.flash('errado', " Ocorreu um problema")
      res.redirect(`/admin/Listar/user`);
   }



})

//desativar user count
router.get(`/admin/desativar/:id`, userAuth, async (req, res) => {
   var id = req.params.id;
   const user = await User.update({ estado: 0 }, { where: { id: id } }).catch(erro => { console.log(erro) })
   if (user) {
      req.flash("certo", "Conta desativado")
      res.redirect(`/admin/user/detalhes/${id}`)
   } else {
      req.flash("errado", "Ocorreu um probleema")
      res.redirect(`/admin/user/detalhes/${id}`)
   }

})
// ativar user count
router.get(`/admin/ativar/:id`, userAuth, async (req, res) => {
   var id = req.params.id;
   const user = await User.update({ estado: 1 }, { where: { id: id } }).catch(erro => { console.log(erro) })
   if (user) {
      req.flash("certo", "Conta desativado")
      res.redirect(`/admin/user/detalhes/${id}`)
   } else {
      req.flash("errado", "Ocorreu um probleema")
      res.redirect(`/admin/user/detalhes/${id}`)
   }
})
//deletar users
router.get(`/admin/user/delete/:id`, userAuth, async (req, res) => {
   var id = req.params.id;

   if (!isNaN(id)) {//se for um numero
      const user = await User.destroy({ where: { id: id } }).catch(err => { console.log(err) });
      if (user) {
         req.flash('certo', " Usuario deletado");
         res.redirect(`/admin/Listar/user`);
      } else {
         req.flash('errado', " Erro ao deletar");
         res.redirect(`/admin/Listar/user`);
      }

   } else {
      req.flash('errado', " Erro ao deletar");
      res.redirect(`/admin/Listar/user`);
   }
});

router.post(`/admin/new/user`, userAuth, async (req, res) => {
   const { name, email, tel, user_name, provincia, municipio, password, password2, sexo } = req.body;

   var img = "unknown.png";
   var estado = 1;
   var role = 2;



   if (name || email || user_name || password || password2 || tel === '') {

      let re = /[A-Z]/;
      const hasUpper = re.test(user_name);
      const verificaEspaco = (user_name) => /\s/g.test(user_name);
      const Mailer = /^[^ ]+@[^ ]+\.[a-z]{2,3}$/.test(email);
      const number = /^[9]{1}[0-9]{8}$/.test(tel)
      const hasUpName = /^[A-Z]{1}[a-z]/;

      if (hasUpper === true) {
         req.flash('errado', "nao cadastrado");
         res.redirect(`/admin/Listar/user`)


      } else if (hasUpName === false) {
         req.flash('errado', "Nome não aceitavel");
         res.redirect(`/admin/Listar/user`)
      }
      else if (verificaEspaco === true) {
         req.flash('errado', "nao cadastrado");
         res.redirect(`/admin/Listar/user`)

      } else
         if (!Mailer) {
            req.flash('errado', "nao cadastrado");
            res.redirect(`/admin/Listar/user`)
         } else
            if (password.length < 5) {
               req.flash('errado', "Senha muito fraca");
               res.redirect(`/admin/Listar/user`)
            } else
               if (password != password2) {
                  req.flash('errado', "Senha Diferentes");
                  res.redirect(`/admin/Listar/user`)

               } else if (number == false) {
                  req.flash('info', "Numero de Telefone incorreto");
                  res.redirect(`/admin/Listar/user`)
               } else {
                  const user = await User.findOne({ where: { email: email } }).catch(err => { console.log(err) });
                  const user2 = await User.findOne({ where: { tel: tel } }).catch(err => { console.log(err) });
                  const user3 = await User.findOne({ where: { user_name: user_name } }).catch(err => { console.log(err) });

                  if (user == undefined) {
                     if (user2 == undefined) {
                        if (user3 == undefined) {
                           var salt = bcrypt.genSaltSync(10);
                           var hash = bcrypt.hashSync(password, salt);
                           const criar = await User.create({name: name, 
                               email: email,tel: tel,user_name: user_name,
                               img: img,password: hash,provincia: provincia
                               ,municipio: municipio,endereco:"Luanda",sexo:sexo,
                               nascimento:"1000-10-10",estado_civil:"SOLTEIRO",nif:'000000-00000-00000',estado: estado,role:role}).catch(err => { console.log(err) })
                           if (criar) {
                              req.flash('certo', "Registado com sucesso");
                              res.redirect(`/funcionario`)
                           } else {
                              req.flash('errado', "Ocorreu um problema");
                              res.redirect(`/funcionario`)
                           }
                        } else {
                           req.flash('errado', "Ocorreu um problema");
                           res.redirect(`/funcionario`)
                        }
                     } else {
                        req.flash('errado', "Ocorreu um problema");
                        res.redirect(`/funcionario`)
                     }
                  } else {
                     req.flash('errado', "Ocorreu um problema");
                     res.redirect(`/funcionario`)
                  }
               }



   } else {
      req.flash('errado', "Ocorreu um problema");
      res.redirect(`/funcionario`)
   }





});
//Admin detalhes user
router.get(`/admin/user/detalhes/:id`, userAuth, async (req, res) => {
   var id = req.params.id;
   const notificacao = await Notificacao.findAll({ where: { estado: 0 } }).catch(erro => { console.log(erro) })
   const contactos = await Contactos.findAll({ where: { estado: 0 } }).catch(erro => { console.log(erro) })
   const relatorio_s = await Relatorio_sinistralidade.findAll({ where: { estado: 0 } }).catch(erro => { console.log(erro) })
   const admin = await User.findOne({ where: { id: req.session.user.id } }).catch(erro => { console.log(erro) })
   const user = await User.findByPk(id).catch(erro => { console.log(erro) })
   const rela_n = await Relatorio_sinistralidade.findAll({where:{ userId: id },include: [{ model: Notificacao}]})
   const veiculo = await Veiculo.findAll({ where: { userId: id } }).catch(erro => { console.log(erro) })
   const noti = await Notificacao.findAll({ attributes: ["mes", [Sequelize.fn('count', Sequelize.col('mes')), 'mescount']], group: "mes", order: ["mes"], where: { userId: id } }).catch(erro => { console.log(erro) })
   const rela_c = await Relatorio_sinistralidade.findAll({ attributes: ["mes", [Sequelize.fn('count', Sequelize.col('mes')), 'mescount']], group: "mes", order: ["mes"], where: { userId: id } }).catch(erro => { console.log(erro) })
  const  local = await Local.findAll({where:{userId:id}}).catch(erro => { console.log(erro) })
  if (user) {

      if (user.role == 2) {
         console.log(rela_n)
         res.render(`admin/corretor`, {local,rela_n, veiculo, contactos, user, admin, certo: req.flash('certo'), errado: req.flash('errado'), notificacao, relatorio_s });
      } else {
         res.render(`admin/usuario`, { veiculo, contactos, user, admin, certo: req.flash('certo'), errado: req.flash('errado'), notificacao, relatorio_s });
      }

   } else {
      res.render("error/errors-404")
   }



});
router.get(`/admin/vews_points`, userAuth, async (req, res) => {
   const notificacao = await Notificacao.findAll({ where: { estado: 0 } }).catch(erro => { console.log(erro) })
   const contactos = await Contactos.findAll({ where: { estado: 0 } }).catch(erro => { console.log(erro) })
   const relatorio_s = await Relatorio_sinistralidade.findAll({ where: { estado: 0 } }).catch(erro => { console.log(erro) })
   const admin = await User.findOne({ where: { id: req.session.user.id } }).catch(erro => { console.log(erro) })
   const dados = await Mypoints.findAll({}).catch(erro => { console.log(erro) })

   res.render(`admin/mapa`, { contactos, admin, dados, certo: req.flash('certo'), errado: req.flash('errado'), notificacao, relatorio_s });


})
router.get(`/admin/vews_points/create`, userAuth, async (req, res) => {
   const notificacao = await Notificacao.findAll({ where: { estado: 0 } }).catch(erro => { console.log(erro) })
   const contactos = await Contactos.findAll({ where: { estado: 0 } }).catch(erro => { console.log(erro) })
   const relatorio_s = await Relatorio_sinistralidade.findAll({ where: { estado: 0 } }).catch(erro => { console.log(erro) })
   const admin = await User.findOne({ where: { id: req.session.user.id } }).catch(erro => { console.log(erro) })

   res.render(`admin/form/mapa`, { contactos, admin, errado: req.flash('errado'), notificacao, relatorio_s });



})
//salvar os pontos
router.post(`/admin/vews_points/save`, userAuth, async (req, res) => {
   const {name, lat, lng, whatsapp, descricao ,entidade} = req.body;
   if (lat ==="" || lng==="") {
      req.flash('errado', "Ocorreu um problema")
      res.redirect(`/admin/vews_points/create`);
      
   } else {
      const number = /^[9]{1}[0-9]{8}$/.test(whatsapp)
      const desc = /^[A-Z][a-z]/.test(descricao)
      const hasUpName = /^[A-Z]{1}[a-z]/.test(name);
      if (number == false) {
         req.flash('errado', "Ocorreu um problema")
         res.redirect(`/admin/vews_points/create`);
      } else if (desc == false) {
         req.flash('errado', "Ocorreu um problema")
         res.redirect(`/admin/vews_points/create`);
      } else if (hasUpName == false) {
         req.flash('errado', "Ocorreu um problema")
         res.redirect(`/admin/vews_points/create`);
      } else {

         const ponto = await Mypoints.create({ name: name, lat: lat, lng: lng, whatsapp: whatsapp, descricao: descricao ,entidade:entidade}).catch(erro => { console.log(erro) })
         if (ponto) {
            req.flash('certo', "Ponto Cadastrado")
            res.redirect(`/admin/vews_points`);
         } else {
            req.flash('errado', "Ocorreu um problema")
            res.redirect(`/admin/vews_points/create`);
         }
      }

   }



});
router.get(`/admin/definiccoes`, userAuth, async (req, res) => {
   const notificacao = await Notificacao.findAll({ where: { estado: 0 } }).catch(erro => { console.log(erro) })
   const contactos = await Contactos.findAll({ where: { estado: 0 } }).catch(erro => { console.log(erro) })
   const relatorio_s = await Relatorio_sinistralidade.findAll({ where: { estado: 0 } }).catch(erro => { console.log(erro) })
   const admin = await User.findOne({ where: { id: req.session.user.id } }).catch(erro => { console.log(erro) })

   res.render(`admin/definicoes`, { contactos, admin, notificacao, relatorio_s });

});

//Editar os pontos do mapa
router.get(`/admin/vews_points/edit/:id`, userAuth, async (req, res) => {
   var id = req.params.id;
   const notificacao = await Notificacao.findAll({ where: { estado: 0 } }).catch(erro => { console.log(erro) })
   const contactos = await Contactos.findAll({ where: { estado: 0 } }).catch(erro => { console.log(erro) })
   const relatorio_s = await Relatorio_sinistralidade.findAll({ where: { estado: 0 } }).catch(erro => { console.log(erro) })
   const admin = await User.findOne({ where: { id: req.session.user.id } }).catch(erro => { console.log(erro) })
   const ponto = await Mypoints.findByPk(id).catch(erro => { console.log(erro) })
   if (ponto) {
      res.render(`admin/form/mapa-editar`, { contactos, ponto, admin, notificacao, relatorio_s });
   } else {
      res.render("error/errors-404")
   }




})
//salvar edição dos dados dospontos do mapa 
router.post(`/admin/points/edit/save`, userAuth, async (req, res) => {
   const { name, lat, lng, whatsapp, descricao, id } = req.body;
   if (lat == undefined) {
      req.flash('errado', "Eita")
      res.redirect(`/admin/vews_points/create`);
   } else {

      if (whatsapp.length < 8) {
         req.flash('errado', "Eita 1")
         res.redirect(`/admin/vews_points`);
      } else if (descricao.length < 10) {
         req.flash('errado', "Eita 2")
         res.redirect(`/admin/vews_points`);
      } else if (name.length < 6) {
         req.flash('errado', "Eita 3")
         res.redirect(`/admin/vews_points`);
      } else {

         const ponto = await Mypoints.update({ name: name, lat: lat, lng: lng, whatsapp: whatsapp, descricao: descricao }, { where: { id: id } }).catch(erro => { console.log(erro) })
         if (ponto) {
            req.flash('certo', "Ponto Cadastrado")
            res.redirect(`/admin/vews_points`);
         } else {
            req.flash('errado', "Eita")
            res.redirect(`/admin/vews_points/create`);
         }
      }

   }


});


//Deletar pontos no mapa
router.get(`/admin/points/delete/:id`, userAuth, async (req, res) => {
   const {id}= req.params;
   if (!isNaN(id)) {//se for um numero
      const ponto = await Mypoints.destroy({ where: { id: id } }).catch(err => { console.log(err) })
      if (ponto) {
         req.flash('certo', "ponto Deletado")
         res.redirect(`/admin/vews_points`)
      } else {
         req.flash('errado', "Aconteceu um erro")
         res.redirect(`/admin/vews_points`);
      }


   } else {
      req.flash('errado', "Aconteceu um erro")
      res.redirect(`/admin/vews_points`);
   }


});



router.get(`/admin/registos-veiculo`, userAuth, async (req, res) => {
   const notificacao = await Notificacao.findAll({ where: { estado: 0 } }).catch(erro => { console.log(erro) })
   const contactos = await Contactos.findAll({ where: { estado: 0 } }).catch(erro => { console.log(erro) })
   const relatorio_s = await Relatorio_sinistralidade.findAll({ where: { estado: 0 } }).catch(erro => { console.log(erro) })
   const admin = await User.findOne({ where: { id: req.session.user.id } }).catch(erro => { console.log(erro) })
   const veiculos = await Veiculo.findAll({ where: { [Op.or]: [{ estado: 1 }, { estado: 2 }] }, include: [{ model: User }] }).catch(erro => { console.log(erro) })

   res.render(`admin/registos_viaturas`, { contactos, veiculos, admin, certo: req.flash('certo'), errado: req.flash('errado'), notificacao, relatorio_s });


});
router.get(`/admin/registos-login`, userAuth, async(req, res) => {
   const notificacao = await Notificacao.findAll({ where: { estado: 0 } }).catch(erro => { console.log(erro) })
   const contactos = await Contactos.findAll({ where: { estado: 0 } }).catch(erro => { console.log(erro) })
   const relatorio_s = await Relatorio_sinistralidade.findAll({ where: { estado: 0 } }).catch(erro => { console.log(erro) })
   const admin = await User.findOne({ where: { id: req.session.user.id } }).catch(erro => { console.log(erro) })
   const reg_login = await Registo_login.findAll({ order: [[`id`, `DESC`]], include: [{ model: User }] }).catch(erro => { console.log(erro) })

   res.render(`admin/registos_login`, { contactos, reg_login, admin, certo: req.flash('certo'), errado: req.flash('errado'), notificacao, relatorio_s });

})
router.get(`/admin/registos-marcacoes`, userAuth, async(req, res) => {
   const notificacao = await Notificacao.findAll({ where: { estado: 0 } }).catch(erro => { console.log(erro) })
   const contactos = await Contactos.findAll({ where: { estado: 0 } }).catch(erro => { console.log(erro) })
   const relatorio_s = await Relatorio_sinistralidade.findAll({ where: { estado: 0 } }).catch(erro => { console.log(erro) })
   const admin = await User.findOne({ where: { id: req.session.user.id } }).catch(erro => { console.log(erro) })
   const marcacoes = await Marcacoes.findAll({ where: { [Op.or]: [{ estado: 1 }, { estado: 2 }] }, include: [{ model: User }] }).catch(erro => { console.log(erro) })

   res.render(`admin/registos_marcacoes`, { contactos,marcacoes, admin, certo: req.flash('certo'), errado: req.flash('errado'), notificacao, relatorio_s });

})


router.get(`/admin/registo-1/delete/:id`, userAuth, async (req, res) => {
   var id = req.params.id;
   const veiculo = await Veiculo.findByPk(id).catch(erro => { console.log(erro) })
   if (veiculo) {
      const deletar = await Veiculo.destroy({ where: { id: id } }).catch(erro => { console.log(erro) });
      if (deletar) {
         req.flash('certo', "Registo eliminado")
         res.redirect(`/admin/registos-notify`)
      } else {
         req.flash('errado', " Ocorreu um problema")
         res.redirect(`/admin/registos-notify`);
      }
   } else {
      req.flash('errado', " Ocorreu um problema")
      res.redirect(`/admin/registos-notify`);
   }
});

router.get(`/admin/registo-3/delete/:id`, userAuth, async(req, res) => {
   var id = req.params.id;
   const marcacao = await Marcacoes.findByPk(id).catch(erro => { console.log(erro) })
   if (marcacao) {
      const marcacao_d = await Marcacoes.destroy({ where: { id: id } }).catch(erro => { console.log(erro) });
      if (marcacao_d) {
         req.flash('certo', "Registo eliminado")
         res.redirect(`/admin/registos-marcacoes`)
      } else {
         req.flash('errado', " Ocorreu um problema")
         res.redirect(`/admin/registos-marcacoes`)
      }
   } else {
      req.flash('errado', " Ocorreu um problema")
      res.redirect(`/admin/registos-marcacoes`)
   }
});
router.get(`/admin/registo-4/delete/:id`, userAuth, async(req, res) => {
   var id = req.params.id;
   const login = await Registo_login.findByPk(id).catch(erro => { console.log(erro) })
   if (login) {
      const login_d = await Registo_login.destroy({ where: { id: id } }).catch(erro => { console.log(erro) });
      if (login_d) {
         req.flash('certo', "Registo eliminado")
         res.redirect(`/admin/registos-login`);
      } else {
         req.flash('errado', " Ocorreu um problema");
         res.redirect(`/admin/registos-login`);
      }
   } else {
      req.flash('errado', " Ocorreu um problema");
      res.redirect(`/admin/registos-login`);
   }

});
//em vez de mudar o estado da notificacao vou mudar da viatura
router.get("/admin/sinitro/integral/:id", userAuth, async(req, res) => {
   var id = req.params.id;
   const notificacao = await Notificacao.findByPk(id).catch(erro =>{console.log(erro)})
   if(notificacao){
      const not = Notificacao.update({ estado: 1 }, {  where: {id:id}}).catch(erro =>{console.log(erro)})
      if(not){
      const rel =  await Relatorio_sinistralidade.update({ estado: 1 }, { where: { notificacoId:id }}).catch(erro =>{console.log(erro)})
      if(rel){
       const rank = await RankNotificacoes.findOne({where:{municipio:notificacao.municipio}}).catch(erro =>{console.log(erro)})
       if(rank){
         const soma = rank.total + 1;
         const rank_u = await RankNotificacoes.update({ total: soma }, { where: { id: rank.id}}).catch(erro =>{console.log(erro)})
           if(rank_u){
            req.flash('certo', " Maravilha")
            res.redirect("/admin/notificacao")
           }else{
            req.flash('errado', " Ocorreu um problema")
            res.redirect("/admin/notificacao")
           }
       }else{
          const rank_c = await  RankNotificacoes.create({ provincia:notificacao.provincia, municipio: notificacao.municipio, total:1}).catch(erro =>{console.log(erro)})
               if(rank_c){
                  req.flash('certo', " Maravila")
                  res.redirect("/admin/notificacao")
               }else{
                  req.flash('errado', " Ocorreu um problema")
                  res.redirect("/admin/notificacao")
               }
         }

      }else{  req.flash('errado', " Ocorreu um problema");res.redirect("/admin/notificacao")}
      }else{  req.flash('errado', " Ocorreu um problema");res.redirect("/admin/notificacao")}
   }else{ req.flash('errado', " Ocorreu um problema");res.redirect("/admin/notificacao")}
 
      
})
router.get("/admin/sinitro/perda-total/:id", userAuth, async(req, res) => {
   var id = req.params.id;
   const notificacao = await Notificacao.findByPk(id).catch(erro =>{console.log(erro)})
   if(notificacao){
      const not = Notificacao.update({ estado: 1 }, {  where: {id: id}}).catch(erro =>{console.log(erro)})
      if(not){
      const rel =  await Relatorio_sinistralidade.update({ estado: 1 }, { where: { notificacoId:notificacao.id }}).catch(erro =>{console.log(erro)})
      if(rel){
      
       const rank = await RankNotificacoes.findOne({where:{municipio:notificacao.municipio}}).catch(erro =>{console.log(erro)})
       if(rank){
         const soma = rank.total + 1;
         const rank_u = await RankNotificacoes.update({ total: soma }, { where: { id: rank.id}}).catch(erro =>{console.log(erro)})
           if(rank_u){
            const veiculo = Veiculo.update({ estado: 2 }, {  where: {matricula:notificacao.matricula}}).catch(erro =>{console.log(erro)})
            if(veiculo){
               req.flash('certo', " Maravilha");
               res.redirect("/admin/notificacao")
            }else{
            req.flash('errado', " Ocorreu um problema");
             res.redirect("/admin/notificacao")
            }
            
           }else{
            req.flash('errado', " Ocorreu um problema");
            res.redirect("/admin/notificacao")
           }
       }else{
          const rank_c = await  RankNotificacoes.create({ provincia:notificacao.provincia, municipio: notificacao.municipio, total:1}).catch(erro =>{console.log(erro)})
               if(rank_c){
                  req.flash('certo', " Maravilha");
                  res.redirect("/admin/notificacao")
               }else{
                  req.flash('errado', " Ocorreu um problema");
                  res.redirect("/admin/notificacao")
               }
         }

      }else{  req.flash('errado', " Ocorreu um problema");res.redirect("/admin/notificacao")}
      }else{  req.flash('errado', " Ocorreu um problema");res.redirect("/admin/notificacao")}
   }else{  req.flash('errado', " Ocorreu um problema");res.redirect("/admin/notificacao")}



  

})

//Deletar Notificação
router.get(`/admin/Notificacao/delete/:id`, userAuth, async (req, res) => {
   var id = req.params.id;
   const notificacao = await Notificacao.findByPk(id).catch(err =>{console.log(err);req.flash("cerrado", "Ocorreu um problema") ;res.redirect(`/admin/notificacao`)})
      
    if(notificacao){
      const not_d =  await Notificacao.destroy({where: { id: id}}).catch(err =>{console.log(err);req.flash("errado", "Ocorreu um problema") ;res.redirect(`/admin/notificacao`)})
        if (not_d){
         req.flash("certo", "Notificacao foi eliminado")
         res.redirect(`/admin/notificacao`)
        }else{req.flash("errado", "Ocorreu um problema")
        res.redirect(`/admin/notificacao`);}
   }else{req.flash("errado", "Ocorreu um problema")
   res.redirect(`/admin/notificacao`);}



});
//Relatorio notificacao 
router.get(`/admin/relatario/notify`, userAuth, async (req, res) => {
   const notificacao = await Notificacao.findAll({ where: { estado: 0 } }).catch(erro => { console.log(erro) })
   const contactos = await Contactos.findAll({ where: { estado: 0 } }).catch(erro => { console.log(erro) })
   const relatorio_s = await Relatorio_sinistralidade.findAll({ where: { estado: 0 }, include: [{ model: User }] }).catch(erro => { console.log(erro) })
   const admin = await User.findOne({ where: { id: req.session.user.id } }).catch(erro => { console.log(erro) })

  res.render(`admin/relatorio`, {notificacao,contactos, relatorio_s, certo: req.flash('certo'), errado: req.flash('errado'),admin })

});
//Relatorio notificacao 
router.get(`/admin/relatario/notify/:id`  ,userAuth, async (req, res) => {
   var id = req.params.id;
   const notificacao = await Notificacao.findAll({ where: { estado: 0 } }).catch(erro => { console.log(erro) })
   const contactos = await Contactos.findAll({ where: { estado: 0 } }).catch(erro => { console.log(erro) })
   const relatorio_s = await Relatorio_sinistralidade.findAll({ where: { estado:0}}).catch(erro => { console.log(erro) })
   const relatorio_unico = await Relatorio_sinistralidade.findOne({ where: { id:id}, include: [{ model: User },{model:Notificacao}] }).catch(erro => { console.log(erro) })
   const admin = await User.findOne({ where: { id: req.session.user.id } }).catch(erro => { console.log(erro) })
       if(relatorio_unico){
      console.log(relatorio_unico)
         
         res.render(`admin/relatorio_unico`, {contactos, relatorio_unico,   notificacao, relatorio_s, certo: req.flash('certo'), errado: req.flash('errado'), admin })
       }else{
          res.render("error/errors-404")
       }

});
//Listar todas as notificações
router.get(`/admin/notificacao`, userAuth, async(req, res) => {
   const notificacao = await Notificacao.findAll({ where: { estado: 0 },include: [{ model: User }] }).catch(erro => { console.log(erro) })
   const contactos = await Contactos.findAll({ where: { estado: 0 } }).catch(erro => { console.log(erro) })
   const relatorio_s = await Relatorio_sinistralidade.findAll({ where: { estado:0}}).catch(erro => { console.log(erro) })
   const admin = await User.findOne({ where: { id: req.session.user.id } }).catch(erro => { console.log(erro) })


  res.render("admin/notificacao", {contactos,notificacao,relatorio_s, certo: req.flash('certo'), errado: req.flash('errado'),admin })
     
})

//Listar todos os relatoris de roubo de viatura '
router.get(`/admin/ocorrencia_roubo`, userAuth, async (req, res) => {
   const notificacao = await Notificacao.findAll({ where: { estado: 0 } }).catch(erro => { console.log(erro) })
   const contactos = await Contactos.findAll({ where: { estado: 0 } }).catch(erro => { console.log(erro) })
   const relatorio_s = await Relatorio_sinistralidade.findAll({ where: { estado: 0 } }).catch(erro => { console.log(erro) })
   const admin = await User.findOne({ where: { id: req.session.user.id } }).catch(erro => { console.log(erro) })
    const roubados = await Alert_roubo.findAll({
      where: { estado: 0 },
      include: [{ model: User }]
   }).catch(erro => { console.log(erro) })


 res.render("admin/roubo_viatura", {contactos, roubados, notificacao,relatorio_s, info: req.flash('info'), certo: req.flash('certo'), errado: req.flash('errado'), admin })
    
 
})
router.get(`/admin/ocorrencia_descricao/:id`, userAuth, async (req, res) => {
   const {id}= req.params;
   const notificacao = await Notificacao.findAll({ where: { estado: 0 } }).catch(erro => { console.log(erro) })
   const contactos = await Contactos.findAll({ where: { estado: 0 } }).catch(erro => { console.log(erro) })
   const relatorio_s = await Relatorio_sinistralidade.findAll({ where: { estado: 0 } }).catch(erro => { console.log(erro) })
   const admin = await User.findOne({ where: { id: req.session.user.id } }).catch(erro => { console.log(erro) })
    const roubados = await Alert_roubo.findOne({
      where: {
         id: id
      },
      include: [{ model: User }]
   }).catch(erro => { console.log(erro) });
   if(roubados!= undefined){
      res.render("admin/roubo_descricao", { contactos, roubados, notificacao, relatorio_s, certo: req.flash('certo'), errado: req.flash('errado'), admin })
   }else{
 res.render("error/errors-404")
   }

})

router.get(`/admin/roubo_viatura/delete/:id`, userAuth, async (req, res) => {
   const {id}= req.params;
   if (!isNaN(id)) {//se for um numero
    const roubo = await  Alert_roubo.destroy({
         where: {
            id: id
         }

      }).catch(erro => { console.log(erro) });
      if(roubo){
         req.flash('certo', " Dados deletado")

         res.redirect(`/admin/ocorrencia_roubo`);
      }else{
         req.flash('errado', " Algo deu errado")
         res.redirect(`/admin/ocorrencia_roubo`);
      }
   
      
   }else{
      req.flash('errado', " Algo deu errado")
      res.redirect(`/admin/ocorrencia_roubo`);
   }





});
router.get(`/admin/roubo_viatura/aprovado/:id`, userAuth, async (req, res) => {
   const {id}= req.params;
   const alert = await Alert_roubo.findByPk(id).catch(err =>{console.log(err)});
   const matricula = alert.matricula;
   const userId = alert.userId;
   const municipio = alert.municipio;
   const provincia = alert.provincia;
 
   if(alert){
   const user = await User.findByPk(userId).catch(err =>{console.log(err)});
   const rank = await RankNotificacoes.findOne({ where: {municipio:municipio}}).catch(err =>{console.log(err)});
   const message = 'Recebemos a informação do roubo da tua viatura, Brevemente entraremos em contactomantenha-se calmo e tenha uma continuação do dia';
   const number = user.tel;
   const alert = await  Alert_roubo.update({ estado: 1 }, {  where: {   id: id}}).catch(err =>{console.log(err)})
   const veiculo = await Veiculo.update({ estado: 1 }, {
      where: {
         matricula: matricula
      }
   }).catch(err =>{console.log(err)})
   
   if(rank != undefined){
     
         const soma =  rank.total + 1;
         const rank2 = await  RankNotificacoes.update({ total: soma }, {
          where: {
             id: rank.id
          }
       }).catch(err =>{console.log(err)})
   }else{
    const rank2 = await  RankNotificacoes.create({
         provincia:provincia,
         municipio:municipio,
         total: 1
      }).catch(err =>{console.log(err)})
   }
   if(alert && veiculo){
      const Mensagen = await twilio.messages.create({
         from: '+19706155674',
         to: `+244${number}`,
         body: message
      }).catch(err =>{console.log(err)})
      if(Mensagen){
         req.flash('certo', "  ")
         res.redirect(`/admin/ocorrencia_roubo`);
      }else{
         req.flash('errado', " Algo deu errado")
         res.redirect(`/admin/ocorrencia_roubo`); 
      }
      }else{
         req.flash('errado', " Algo deu errado")
         res.redirect(`/admin/ocorrencia_roubo`);
      }

   }else{
      req.flash('errado', " Algo deu errado")
         res.redirect(`/admin/ocorrencia_roubo`);
   }

 

});


router.get(`/admin/deletar_viatura/:id`, userAuth, async (req, res) => {
   var id = req.params.id;
   const veiculo2 = await Veiculo.findByPk(id).catch(erro => { console.log(erro) })
   if (!isNaN(id)) {//se for um numero
      const veiculo = await Veiculo.destroy({ where: { id: id } }).catch(erro => { console.log(erro) })
      if (veiculo) {
         req.flash('certo', " viatura deletado")
         res.redirect(`/admin/user/detalhes/${veiculo2.userId}`);
      } else {

      }
   } else {
      req.flash('errado', " Algo deu errado")
      res.redirect(`/admin/user/detalhes/${veiculo2.userId}`);
   }



});
//Parte de fazer uploadsss
router.get(`/admin/upload`,userAuth, async (req, res) => {
   const notificacao = await Notificacao.findAll({ where: { estado: 0 } }).catch(erro => { console.log(erro) })
   const contactos = await Contactos.findAll({ where: { estado: 0 } }).catch(erro => { console.log(erro) })
   const relatorio_s = await Relatorio_sinistralidade.findAll({ where: { estado: 0 } }).catch(erro => { console.log(erro) })
   const admin = await User.findOne({ where: { id: req.session.user.id } }).catch(erro => { console.log(erro) })
  
    res.render(`admin/form/upload`, {notificacao,contactos,relatorio_s,admin})
  

})

router.post(`/admin/upload/save`, upload.single(`file`), userAuth, async (req, res) => {
   var imagename = req.file.filename;
   const user = await   User.update({ img: imagename }, {
      where: {
         id: req.session.user.id
      }
   }).catch(erro => { console.log(erro) })
   if(user){
      req.flash("certo","Foto Carregado")
      res.redirect(`/admin/index`)
   }else{
      res.redirect(`/admin/index`)
   }
     
})


//rank Notificacoes
router.get(`/admin/rank_notificacoes`, userAuth, async (req, res) => {
   const notificacao = await Notificacao.findAll({ where: { estado: 0 } }).catch(erro => { console.log(erro) })
   const contactos = await Contactos.findAll({ where: { estado: 0 } }).catch(erro => { console.log(erro) })
   const relatorio_s = await Relatorio_sinistralidade.findAll({ where: { estado: 0 } }).catch(erro => { console.log(erro) })
   const admin = await User.findOne({ where: { id: req.session.user.id } }).catch(erro => { console.log(erro) })
   const estatistica = await RankNotificacoes.findAll({}).catch(erro => { console.log(erro) });

   res.render(`admin/rank_notificacoes`, {  estatistica,  contactos,  admin, certo: req.flash('certo'), errado: req.flash('errado'),  notificacao, relatorio_s })

      
});

//PDF START
router.post("/admin/usuario_notificacao",async (req,res)=>{
   const {inicio,fim,sexo,tipo}= req.body;
   if(inicio == "" || fim == ""|| sexo=="" ||tipo ==""){
      req.flash("errado","Ocorreu um problema")
      res.redirect("/admin/notificacao/relatorio")
   }else{
  

  if(inicio >fim){
   req.flash("errado","Tempo Limite Invalido") 
   res.redirect("/admin/notificacao/relatorio")
  }else if(sexo =="0"){
          if(tipo =="0"){
            const  ap = await Apolice.findAll({ 
               where:{
                  
                  createdAt:{
                     [Op.between]:[new Date(inicio) ,new Date(fim)]
                  }
               },
      
             include:[
                {
                   model:User
                   
                }
             ]
            }).catch(erro =>{ console.log(erro) })
          
            const p = ap.map(e=>{
               var m = e.dataValues.tipo_seguro;
               var ti_s;
               switch (m) {
                  case 1:
                     ti_s="Contra Terceiro"
                     break;
                     case 2:
                    ti_s="Contra Terceiro Avançado"
                     break;
                     case 3:
                     ti_s="Contra Todos os riscos"
                     break;
                  default:
                     break;
               }
               return {nome:e.dataValues.user.name,tel:e.dataValues.user.tel,email:e.dataValues.user.email,tipo:ti_s,data:e.dataValues.createdAt}
            })
            res.render("admin/PDF/usuario_seguro",{p})
          }else{
            const  ap = await Apolice.findAll({ 
               where:{
                  
                  createdAt:{
                     [Op.between]:[new Date(inicio) ,new Date(fim)]
                  }
               },
         
               where:{
                  tipo_seguro:tipo
               },
               
         
      
             include:[
                {
                   model:User
                  
                }
             ]
            }).catch(erro =>{ console.log(erro) })
            
          
            const p = ap.map(e=>{
               var m = e.dataValues.tipo_seguro;
               var ti_s;
               switch (m) {
                  case 1:
                     ti_s="Contra Terceiro"
                     break;
                     case 2:
                     ti_s="Contra Terceiro Avançado"
                     break;
                     case 3:
                     ti_s="Contra Todos os riscos"
                     break;
                  default:
                     break;
               }
               return {nome:e.dataValues.user.name,tel:e.dataValues.user.tel,email:e.dataValues.user.email,tipo:ti_s,data:e.dataValues.createdAt}
            })
      
             
           res.render("admin/PDF/usuario_seguro",{p})
//fara algo
          }

  }else if(tipo=="0"){
          if(sexo=="0"){
            const  ap = await Apolice.findAll({ 
               where:{
                  
                  createdAt:{
                     [Op.between]:[new Date(inicio) ,new Date(fim)]
                  }
               },
      
             include:[
                {
                   model:User
                   
                }
             ]
            }).catch(erro =>{ console.log(erro) })
          
            const p = ap.map(e=>{
               var m = e.dataValues.tipo_seguro;
               var ti_s;
               switch (m) {
                  case 1:
                     ti_s="Contra Terceiro"
                     break;
                     case 2:
                    ti_s="Contra Terceiro Avançado"
                     break;
                     case 3:
                     ti_s="Contra Todos os riscos"
                     break;
                  default:
                     break;
               }
               return {nome:e.dataValues.user.name,tel:e.dataValues.user.tel,email:e.dataValues.user.email,tipo:ti_s,data:e.dataValues.createdAt}
            })
            res.render("admin/PDF/usuario_seguro",{p})
          }else{
//fara algo
const  ap = await Apolice.findAll({ 
   where:{
      
      createdAt:{
         [Op.between]:[new Date(inicio) ,new Date(fim)]
      }
   },
   


 include:[
    {
       model:User,
       where:{
         sexo:sexo
               }
      
    }
 ]
}).catch(erro =>{ console.log(erro) })


const p = ap.map(e=>{
   var m = e.dataValues.tipo_seguro;
   var ti_s;
   switch (m) {
      case 1:
         ti_s="Contra Terceiro"
         break;
         case 2:
         ti_s="Contra Terceiro Avançado"
         break;
         case 3:
         ti_s="Contra Todos os riscos"
         break;
      default:
         break;
   }
   return {nome:e.dataValues.user.name,tel:e.dataValues.user.tel,email:e.dataValues.user.email,tipo:ti_s,data:e.dataValues.createdAt}
})

res.render("admin/PDF/usuario_seguro",{p})
          }
  }else{
//fara algo
const  ap = await Apolice.findAll({ 
   where:{
      
      createdAt:{
         [Op.between]:[new Date(inicio) ,new Date(fim)]
      }
   },
   
         
            where:{
               tipo_seguro:tipo
            },
   


 include:[
    {
       model:User,
       sexo:sexo
      
    }
 ]
}).catch(erro =>{ console.log(erro) })


const p = ap.map(e=>{
   var m = e.dataValues.tipo_seguro;
   var ti_s;
   switch (m) {
      case 1:
         ti_s="Contra Terceiro"
         break;
         case 2:
         ti_s="Contra Terceiro Avançado"
         break;
         case 3:
         ti_s="Contra Todos os riscos"
         break;
      default:
         break;
   }
   return {nome:e.dataValues.user.name,tel:e.dataValues.user.tel,email:e.dataValues.user.email,tipo:ti_s,data:e.dataValues.createdAt}
})

 
res.render("admin/PDF/usuario_seguro",{p})
  }
}
  

})
router.post("/admin/usuario_seguro",async (req,res)=>{
   const {inicio,fim,sexo,tipo}= req.body;


   if(inicio == "" || fim == ""|| sexo=="" ||tipo ==""){
      req.flash("errado","Ocorreu um problema") 
      res.redirect("/admin/notificacao/relatorio")
   }else{

  if(inicio >fim){
   req.flash("errado","Tempo Limite Invalido") 
   res.redirect("/admin/notificacao/relatorio")
  }else if(sexo == "0"){
          if(tipo == "0"){
            const  ap = await Alert_roubo.findAll({ 
               where:{
                  
                  createdAt:{
                     [Op.between]:[new Date(inicio) ,new Date(fim)]
                  }
               },
      
             include:[
                {
                   model:User,
                   
                }
             ]
            }).catch(erro =>{ console.log(erro) })
          
            const r = ap.map(e=>{
               return {nome:e.dataValues.user.name,tel:e.dataValues.user.tel,email:e.dataValues.user.email,tipo:"Acidente Rodoviario",data:e.dataValues.createdAt}
            })
            const  notify = await Notificacao.findAll({ 
               where:{
                  
                  createdAt:{
                     [Op.between]:[new Date(inicio) ,new Date(fim)]
                  }
               },
             include:[
                {
                   model:User
                   
                }
             ]
            }).catch(erro =>{ console.log(erro) })
                 const t = notify.map(e=>{
                    return {nome:e.dataValues.user.name,tel:e.dataValues.user.tel,email:e.dataValues.user.email,tipo:"Acidente Rodoviario",data:e.dataValues.createdAt}
                 })
            console.log(t)
       console.log(r)
           res.render("admin/PDF/usuarioNotificacao",{t,r})
          }else{
              if(tipo =="1"){
               const  ap = await Alert_roubo.findAll({ 
                  where:{
                     
                     createdAt:{
                        [Op.between]:[new Date(inicio) ,new Date(fim)]
                     }
                  },
         
                include:[
                   {
                      model:User
                      
                   }
                ]
               }).catch(erro =>{ console.log(erro) })
             
               const r = ap.map(e=>{
                  return {nome:e.dataValues.user.name,tel:e.dataValues.user.tel,email:e.dataValues.user.email,tipo:"Roubo de Viatura",data:e.dataValues.createdAt}
               })
               var t= null;
               res.render("admin/PDF/usuarioNotificacao",{t,r})

              }else{
               
               const  notify = await Notificacao.findAll({ 
                  where:{
                     
                     createdAt:{
                        [Op.between]:[new Date(inicio) ,new Date(fim)]
                     }
                  },
                include:[
                   {
                      model:User
                      
                   }
                ]
               }).catch(erro =>{ console.log(erro) })
                    const t = notify.map(e=>{
                       return {nome:e.dataValues.user.name,tel:e.dataValues.user.tel,email:e.dataValues.user.email,tipo:"Acidente Rodoviario",data:e.dataValues.createdAt}
                    })
                    var r = null
                    res.render("admin/PDF/usuarioNotificacao",{t,r})
          

              }
//fara algo
          }

  }else if(tipo=="0"){
          if(sexo=="0"){
            const  ap = await Alert_roubo.findAll({ 
               where:{
                  
                  createdAt:{
                     [Op.between]:[new Date(inicio) ,new Date(fim)]
                  }
               },
      
             include:[
                {
                   model:User
                   
                }
             ]
            }).catch(erro =>{ console.log(erro) })
          
            const r = ap.map(e=>{
               return {nome:e.dataValues.user.name,tel:e.dataValues.user.tel,email:e.dataValues.user.email,tipo:"Roubo De viatura",data:e.dataValues.createdAt}
            })
            const  notify = await Notificacao.findAll({ 
               where:{
                  
                  createdAt:{
                     [Op.between]:[new Date(inicio) ,new Date(fim)]
                  }
               },
             include:[
                {
                   model:User
                   
                }
             ]
            }).catch(erro =>{ console.log(erro) })
                 const t = notify.map(e=>{
                    return {nome:e.dataValues.user.name,tel:e.dataValues.user.tel,email:e.dataValues.user.email,tipo:"Acidente Rodoviario",data:e.dataValues.createdAt}
                 })
            console.log(t)
       console.log(r)
       res.render("admin/PDF/usuarioNotificacao",{t,r})
          }else{
             
            const  ap = await Alert_roubo.findAll({ 
               where:{
                  
                  createdAt:{
                     [Op.between]:[new Date(inicio) ,new Date(fim)]
                  }
               },
      
             include:[
                {
                   model:User,
                   where:{
                     sexo:sexo
                           }
                   
                }
             ]
            }).catch(erro =>{ console.log(erro) })
          
            const r = ap.map(e=>{
               return {nome:e.dataValues.user.name,tel:e.dataValues.user.tel,email:e.dataValues.user.email,tipo:"Roubo de Viatura",data:e.dataValues.createdAt}
            })
            const  notify = await Notificacao.findAll({ 
               where:{
                  
                  createdAt:{
                     [Op.between]:[new Date(inicio) ,new Date(fim)]
                  }
               },
             include:[
                {
                   model:User,
                   where:{
                     sexo:sexo
                           }
                   
                }
             ]
            }).catch(erro =>{ console.log(erro) })
                 const t = notify.map(e=>{
                    return {nome:e.dataValues.user.name,tel:e.dataValues.user.tel,email:e.dataValues.user.email,tipo:"Acidente Rodoviario",data:e.dataValues.createdAt}
                 })
                 res.render("admin/PDF/usuarioNotificacao",{t,r})
          }
  }else if(tipo =="1"){
          if(sexo =="0"){
            const  ap = await Alert_roubo.findAll({ 
               where:{
                  
                  createdAt:{
                     [Op.between]:[new Date(inicio) ,new Date(fim)]
                  }
               },
      
             include:[
                {
                   model:User
                   
                }
             ]
            }).catch(erro =>{ console.log(erro) })
          
            const r = ap.map(e=>{
               return {nome:e.dataValues.user.name,tel:e.dataValues.user.tel,email:e.dataValues.user.email,tipo:"Roubo De viatura",data:e.dataValues.createdAt}
            })
         var t= null;
            res.render("admin/PDF/usuarioNotificacao",{t,r})

          }else{
            const  ap = await Alert_roubo.findAll({ 
               where:{
                  
                  createdAt:{
                     [Op.between]:[new Date(inicio) ,new Date(fim)]
                  }
               },
      
             include:[
                {
                   model:User,
                   where:{
                     sexo:sexo
                           }
                   
                }
             ]
            }).catch(erro =>{ console.log(erro) })
          
            const r = ap.map(e=>{
               return {nome:e.dataValues.user.name,tel:e.dataValues.user.tel,email:e.dataValues.user.email,tipo:"Roubo De viatura",data:e.dataValues.createdAt}
            })
         var t= null;
            res.render("admin/PDF/usuarioNotificacao",{t,r})
          }

  }else if(tipo == "2"){
           if(sexo=="0"){
            const  notify = await Notificacao.findAll({ 
               where:{
                  
                  createdAt:{
                     [Op.between]:[new Date(inicio) ,new Date(fim)]
                  }
               },
             include:[
                {
                   model:User
                   
                }
             ]
            }).catch(erro =>{ console.log(erro) })
                 const t = notify.map(e=>{
                    return {nome:e.dataValues.user.name,tel:e.dataValues.user.tel,email:e.dataValues.user.email,tipo:"Acidente Rodoviario",data:e.dataValues.createdAt}
                 })
                 var r=null;
                 res.render("admin/PDF/usuarioNotificacao",{t,r})

           }else{
            const  notify = await Notificacao.findAll({ 
               where:{
                  
                  createdAt:{
                     [Op.between]:[new Date(inicio) ,new Date(fim)]
                  }
               },
             include:[
                {
                   model:User,
                   where:{
                     sexo:sexo
                           }
                }
             ]
            }).catch(erro =>{ console.log(erro) })
                 const t = notify.map(e=>{
                    return {nome:e.dataValues.user.name,tel:e.dataValues.user.tel,email:e.dataValues.user.email,tipo:"Acidente Rodoviario",data:e.dataValues.createdAt}
                 })
                 var r=null;
                 res.render("admin/PDF/usuarioNotificacao",{t,r})
           }

  }else if(sexo !="0"){
     if(tipo =="1"){
      const  ap = await Alert_roubo.findAll({ 
         where:{
            
            createdAt:{
               [Op.between]:[new Date(inicio) ,new Date(fim)]
            }
         },

       include:[
          {
             model:User,
             where:{
               sexo:sexo
                     }
             
          }
       ]
      }).catch(erro =>{ console.log(erro) })
    
      const r = ap.map(e=>{
         return {nome:e.dataValues.user.name,tel:e.dataValues.user.tel,email:e.dataValues.user.email,tipo:"Roubo De viatura",data:e.dataValues.createdAt}
      })
      var t =null;
   
 res.render("admin/PDF/usuarioNotificacao",{t,r})
     }else if(tipo=="2"){
      const  notify = await Notificacao.findAll({ 
         where:{
            
            createdAt:{
               [Op.between]:[new Date(inicio) ,new Date(fim)]
            }
         },
       include:[
          {
             model:User,
             where:{
               sexo:sexo
                     }
             
          }
       ]
      }).catch(erro =>{ console.log(erro) })
           const t = notify.map(e=>{
              return {nome:e.dataValues.user.name,tel:e.dataValues.user.tel,email:e.dataValues.user.email,tipo:"Acidente Rodoviario",data:e.dataValues.createdAt}
           })
          
           res.render("admin/PDF/usuarioNotificacao",{t,r})
     }else{
      const  ap = await Alert_roubo.findAll({ 
         where:{
            
            createdAt:{
               [Op.between]:[new Date(inicio) ,new Date(fim)]
            }
         },

       include:[
          {
             model:User,
             where:{
               sexo:sexo
            }
             
          }
       ]
      }).catch(erro =>{ console.log(erro) })
    
      const r = ap.map(e=>{
         return {nome:e.dataValues.user.name,tel:e.dataValues.user.tel,email:e.dataValues.user.email,tipo:"Acidente Rodoviario",data:e.dataValues.createdAt}
      })
      const  notify = await Notificacao.findAll({ 
         where:{
            
            createdAt:{
               [Op.between]:[new Date(inicio) ,new Date(fim)]
            }
         },
       include:[
          {
             model:User,
             where:{
                sexo:sexo
             }
             
          }
       ]
      }).catch(erro =>{ console.log(erro) })
           const t = notify.map(e=>{
              return {nome:e.dataValues.user.name,tel:e.dataValues.user.tel,email:e.dataValues.user.email,tipo:"Acidente Rodoviario",data:e.dataValues.createdAt}
           })
           
           res.render("admin/PDF/usuarioNotificacao",{t,r})
     }
   
  }else{
   res.render("error/errors-404")
  }
}
  

})

router.get("/admin/apolice/pdf/:id",async (req, res) => {
   const {id}= req.params;
const apolice =  await Apolice.findOne({
   where: { id: id },
   include: [{ model: User }]
}).catch(erro => { console.log(erro) });

if(apolice){
const veiculo =  await Veiculo.findOne({
   where: {
      matricula: apolice.matricula
   }
}).catch(erro => { console.log(erro) });


if(veiculo){
   res.render("admin/PDF/apolice", {veiculo,apolice })
}else{
   res.render("error/errors-404")
}
}else{
res.render("error/errors-404")
}
   





});

//comprovante
router.get("/admin/comprovante/pdf/:id", async (req, res) => {
   const {id}= req.params;
   const apolice =  await Apolice.findOne({
      where: { id: id },
      include: [{ model: User }]
   }).catch(erro => { console.log(erro) });
   
   if(apolice){
      const url = `localhost:8080/user/comprovante/pdf/checar/${id}`;
      Qr.toDataURL(url, (erro, src) => {
         if (erro) {
            res.render("error/errors-404")
         } else {
            res.render("admin/PDF/comprovante", { src,apolice })

         }

      })
   }else{
   res.render("error/errors-404")
   }
      
 



});








module.exports = router;