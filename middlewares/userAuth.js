function User(req, res, next){
    if(req.session.user != undefined){
    
        if(req.session.user.role == 0){
            next();
           }else{
               res.render("error/errors-403")
           }
     
       
    }else{
        res.redirect("/formlogin");
    }
 }
 
 module.exports = User