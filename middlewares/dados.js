function Sessao(req, res, next){
   if(req.session.dados == undefined){
    res.redirect("/registar_se")
   }else {
       next()
   }
}

module.exports = Sessao