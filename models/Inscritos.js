const Sequelize = require("sequelize");
const connection = require("../database/database");


const Inscritos = connection.define('inscritos',{
     email:{
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


//Inscritos.sync({force:true});
module.exports = Inscritos;