const Sequelize = require("sequelize");
const connection = require("../database/database");
const Marcacao = require("./Marcacoes");

const Comprovativo = connection.define('comprovativo',{
      comprovativo:{
          type:Sequelize.STRING,
          allowNull:false,
          
       },
       
 estado:{
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
Marcacao.hasMany(Comprovativo,{
   onDelete:'Cascade'  
  });
  Comprovativo.belongsTo(Marcacao);

//Comprovativo.sync({force:true});
module.exports  = Comprovativo;