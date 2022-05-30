const express = require("express");

const Contactos = require("../models/Contactos")
const router = express.Router();
const Mypoints = require("../models/Mypoints");
const Inscrito = require("../models/Inscritos");
const User = require(`../models/User`);
const adminAuth = require("../middlewares/adminAuth")
const Notificacao = require(`../models/Notificacao`)
const Relatorio_sinistralidade = require("../models/Relatorio_sinistralidade");


 

 router.post("/contact/save",(req, res) => {
   var name = req.body.name;
   var email = req.body.email;
   var message = req.body.message;
   var subject = req.body.subject;
   var estado = 0;
  
   if (name && email != undefined) {

      Contactos.create({
         name: name,
         message: message,
         email: email,
        subject:subject,
        estado: estado
     }).then(() => {
      req.flash("certo","Menssagem enviado com sucesso")
         res.redirect("/")
     })

  } else {
     req.flash("errado","Ocorreu um problema ao enviar a mensagem")
      res.redirect("/")
      
  }
  
})  // 
//desativar user count
router.post("/inscrito/save", (req, res) => {
   var email = req.body.email;
   if ( email != undefined) {
      Inscrito.findOne({
         where:{
            email:email
         }
      }).then(result =>{
         if(result == undefined){
            Inscrito.create({
        
               email: email
             
           }).then(() => {
            req.flash("certo","Foste inscrito")
               res.redirect("/")
           }).catch(()=>{
            req.flash("errado","Não foste inscrito ,ocorreu um problema")
            res.redirect("/")
           })
         }else{
            req.flash("info","Ja estas inscrito")
             res.redirect("/") 
         }
      })
    

  } else {
     req.flash("errado","Não foste inscrito ,ocorreu um problema")
      res.redirect("/")
      
  }
})


 router.get("/admin/inscritos", adminAuth ,async (req, res) => {
   const notificacao = await Notificacao.findAll({ where: { estado: 0 } }).catch(erro => { console.log(erro) })
   const contactos = await Contactos.findAll({ where: { estado: 0 } }).catch(erro => { console.log(erro) })
   const relatorio_s = await Relatorio_sinistralidade.findAll({ where: { estado: 0 } }).catch(erro => { console.log(erro) })
   const admin = await User.findOne({ where: { id: req.session.user.id } }).catch(erro => { console.log(erro) })
const inscritos =await  Inscrito.findAll({
      order: [
         ['id', 'DESC']
      ]
 
   }).catch(erro => { console.log(erro) })
     
  res.render("admin/inscritos", {contactos,inscritos ,admin,certo:req.flash('certo'),errado:req.flash('errado'),notificacao,relatorio_s });
     
 })
 router.get("/admin/dashboard/delete/:id", adminAuth , async (req, res) => {
    const {id}= req.params;

      if (!isNaN(id)) {//se for um numero
      const contacto= await   Contactos.destroy({
            where: {
               id: id
            }
 
         }).catch(erro => { console.log(erro) });
         if(contacto){
            req.flash("certo","Contacto foi eliminado")
            res.redirect("/admin/dashboard")
         }else{
            req.flash("errado","Ocorreu um problema")
         res.redirect("/admin/dashboard");
         }
            
         
      } else {
         req.flash("errado","Ocorreu um problema")
         res.redirect("/admin/dashboard");
      }
 
  
 })
 router.get("/admin/inscritos/delete/:id", adminAuth , async (req, res) => {
   const {id}= req.params;

   if (!isNaN(id)) {//se for um numero
   const inscritos= await   Inscrito.destroy({
         where: {
            id: id
         }

      }).catch(erro => { console.log(erro) });
      if(inscritos){
         req.flash("certo","inscrito foi eliminado")
         res.redirect("/admin/inscritos")
      }else{
         req.flash("errado","Ocorreu um problema")
      res.redirect("/admin/inscritos");
      }
         
      
   } else {
      req.flash("errado","Ocorreu um problema")
      res.redirect("/admin/inscritos");
   }
 
 })
 router.get(`/marcarlido/:id`, adminAuth ,async (req, res) => {
 const {id}= req.params;
const contacto = await Contactos.update({estado:1},{
   where:{
      id:id
   }
}).catch(erro => { console.log(erro) });
if(contacto){
   res.redirect("/admin/dashboard")
}else{
   req.flash("errado","Ocorreu um problema")
   res.redirect("/admin/dashboard")
}
  
})
 router.get(`/admin/iteragir/:id`, adminAuth , async (req, res) => {
   const { id }= req.params;
   const notificacao = await Notificacao.findAll({ where: { estado: 0 } }).catch(erro => { console.log(erro) })
   const contactos = await Contactos.findAll({ where: { estado: 0 } }).catch(erro => { console.log(erro) })
   const relatorio_s = await Relatorio_sinistralidade.findAll({ where: { estado: 0 } }).catch(erro => { console.log(erro) })
   const admin = await User.findOne({ where: { id: req.session.user.id } }).catch(erro => { console.log(erro) })
  const  contacto = await  Contactos.findByPk(id).catch(erro => { console.log(erro) });
  if(contacto){
   res.render(`admin/form/contactos`, {contactos, contacto,admin,notificacao,relatorio_s });
  }else{

  }


             
 

});
module.exports = router; 