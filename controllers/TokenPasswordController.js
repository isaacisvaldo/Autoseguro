const express = require("express")
const router = express.Router();
const User = require("../models/User");
const bcrypt = require('bcryptjs');

router.get("/user/token",(req,res)=>{
    res.render("form/esqueci-senha")

})
router.get("/user/password",(req,res)=>{
   res.render("form/nova-senha")
  
})
//Gerar o Token
router.post("/user/Token/password", async(req,res)=>{
    var {email} = req.body; 
 const user = await    User.findOne({ where: { email: email } }).catch(err =>{console.log(err)})
       if(user){
        req.session.token = undefined;
        const getRandomIntegerInclusive = (min, max) =>
        Math.floor(Math.random() * (max - min + 1)) + min

        var token = getRandomIntegerInclusive(10000, 90000);
        req.session.token = {
          token:token,
          email:email,
          id:user.id
       };
        res.render("form/send",{token,email})
        } else {
            console.log("Este email é invalido");
           res.redirect("/user/token") 
         
        }
   

});
//Alterar a password E marcar o Token como usado      var salt = bcrypt.genSaltSync(10);
          //  var hash = bcrypt.hashSync(newPassword, salt);
          //  User.update({ password:hash}, {
              //  where: {
            //       id: token.userId
              //  }
router.post("/user/novasenha", async(req,res)=>{
        const {senha,senha2,token}=req.body;
        if(senha === ""|| senha2 ==="" || token === ""){
          req.flash("info","Dados incorretos")
          res.redirect("/user/token")
        }else{
          if(senha != senha2){
            req.flash("errado","senhas Diferentes")
             res.redirect("/user/token")
          }else{
            if(req.session.token != undefined){
              if(token == req.session.token.token){
              var salt = bcrypt.genSaltSync(10);
             var hash = bcrypt.hashSync(senha, salt);
             const user = await   User.update({ password:hash},{  where:{id:req.session.token.id}},).catch(err =>{console.log(err)})
             
             if(user){
             req.flash("certo","Senha Alterada");
             req.session.token = undefined;
             res.redirect("/formlogin")
           }
          }else{
            req.flash("errado","Tempo esgotou")
            res.redirect("/user/token")
            }
          }else{
            req.flash("errado","Token Incorreto")
            res.redirect("/user/token")
          }
        }
        }
   
})

module.exports = router;