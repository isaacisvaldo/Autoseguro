function adminAuth(req, res, next){
   if(req.session.user != undefined){
       if(req.session.user.role == 2){
        next();
       }else{
           res.render("error/errors-403")
       }
      
   }else{
       res.redirect("/formlogin");
   }
}

module.exports = adminAuth