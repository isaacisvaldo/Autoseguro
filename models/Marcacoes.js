const Sequelize = require("sequelize");
const connection = require("../database/database");
const User = require("./User");

const Marcacoes = connection.define('marcacoes',{
      secret:{
          type:Sequelize.STRING,
          allowNull:false,
          
       },
       quantia_pagar:{
        type:Sequelize.INTEGER,
        allowNull:false
     },
     data_marcacao:{
        type:Sequelize.INTEGER,
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
User.hasMany(Marcacoes ,{
   onDelete:'Cascade'  
  });
Marcacoes.belongsTo(User);

//Marcacoes.sync({force:true});
module.exports = Marcacoes;