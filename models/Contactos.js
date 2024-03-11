const Sequelize = require("sequelize");
const connection = require("../database/database");


const Contactos = connection.define('contactos',{
      name:{
          type:Sequelize.STRING,
          allowNull:false
       },
       message:{
        type:Sequelize.TEXT,
        allowNull:false
     },
     email:{
        type:Sequelize.STRING,
        allowNull:false
     }
     ,
     subject:{
      type:Sequelize.STRING,
      allowNull:false
     },
     estado:{
        type:Sequelize.TINYINT,
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


//Contacto.sync({force:true});
module.exports = Contactos;