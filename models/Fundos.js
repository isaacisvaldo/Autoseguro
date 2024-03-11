const Sequelize = require("sequelize");
const connection = require("../database/database");
const User = require("./User");

const Fundos = connection.define('fundos',{
    
       saldo:{
        type:Sequelize.INTEGER,
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

 Fundos.belongsTo(User,{
   onDelete:'Cascade'  
  });

// Fundos.sync({force:true});
module.exports =  Fundos;