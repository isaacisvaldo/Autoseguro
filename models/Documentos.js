const Sequelize = require("sequelize");
const connection = require("../database/database");
const User = require("./User");

const Documentos = connection.define('documentos',{
   nif:{
      type:Sequelize.STRING,
      allowNull:false
   },  
   carta_conducao:{
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
Documentos.belongsTo(User,{
   onDelete:'Cascade'  
  });

//Documentos.sync({force:true});
module.exports = Documentos;