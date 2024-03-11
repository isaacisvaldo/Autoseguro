const Sequelize = require("sequelize");
const connection = require("../database/database");



const RankNotificacao = connection.define('rankNotificacao',{
   provincia:{
      type:Sequelize.STRING,
      allowNull:false
   },  
   municipio:{
          type:Sequelize.STRING,
          allowNull:false
       },
       total:{
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



//RankNotificacao.sync({force:true});
module.exports = RankNotificacao;