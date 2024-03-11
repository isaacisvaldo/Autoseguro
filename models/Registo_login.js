const Sequelize = require("sequelize");
const connection = require("../database/database");
const User = require("./User");

const Registo_login = connection.define('registo_login',{
     
       hostname:{
        type:Sequelize.STRING,
        allowNull:false
     },
    tipo :{
      type:Sequelize.STRING,
      allowNull:false
   },
  plataforma :{
      type:Sequelize.STRING,
      allowNull:false
   },
   createdAt:{
      type:Sequelize.DATEONLY,
      allowNull:false
   },
   updatedAt:{
    type:Sequelize.DATEONLY,
    allowNull:false
 }
});
User.hasMany(Registo_login ,{
   onDelete:'Cascade'  
  });
Registo_login .belongsTo(User);

//Registo_login.sync({force:true});
module.exports = Registo_login;