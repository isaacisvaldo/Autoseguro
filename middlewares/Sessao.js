function Sessao(req, res, next){
   if(req.session.user != undefined){
      res.render("error/errors-404")
   }else {
       next()
   }
}

module.exports = Sessao