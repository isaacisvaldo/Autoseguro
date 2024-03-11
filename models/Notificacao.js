const Sequelize = require("sequelize");
const connection = require("../database/database");
const User = require("./User");

const Notificacao = connection.define('notificacoes',{
      descricao:{
          type:Sequelize.STRING,
          allowNull:false
       },
       lat:{
        type:Sequelize.FLOAT,
        allowNull:false
     },
     lng:{
        type:Sequelize.FLOAT,
        allowNull:false
     },
     matricula:{
        type:Sequelize.STRING,
        allowNull:false
     },
     img:{
      type:Sequelize.STRING,
      allowNull:false
   },
   danos_terceiro:{
      type:Sequelize.STRING,
      allowNull:false
   },
   provincia:{
      type:Sequelize.STRING,
      allowNull:false
   },
   municipio:{
      type:Sequelize.STRING,
      allowNull:false
   },
   estado:{
    type:Sequelize.TINYINT,
    allowNull:false
 },
 mes:{
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
User.hasMany(Notificacao ,{
   onDelete:'Cascade'  
  });
Notificacao .belongsTo(User);

//Notificacao.sync({force:true});
module.exports = Notificacao;