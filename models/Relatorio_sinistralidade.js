const Sequelize = require("sequelize");
const connection = require("../database/database");
const Notificacao = require("./Notificacao");
const User = require("./User");


const Relatorio_sinistralidade = connection.define('relatorio_sinistralidade',{
     
  
   matricula_terceiro:{
      type:Sequelize.STRING,
      allowNull:false
   },
   bi:{
      type:Sequelize.STRING,
      allowNull:false
   },
   tipo_sinistralidade:{
      type:Sequelize.STRING,
      allowNull:false
   },
   img_atual:{
      type:Sequelize.STRING,
      allowNull:false
   },
    descricao:{
      type:Sequelize.TEXT,
      allowNull:false
   },
   estado:{
      type:Sequelize.TINYINT,
      allowNull:false
   },
   mes:{
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

Relatorio_sinistralidade .belongsTo(Notificacao,{
   onDelete:'Cascade'  
  });
  Relatorio_sinistralidade.belongsTo(User);

//Relatorio_sinistralidade.sync({force:true});
module.exports = Relatorio_sinistralidade;