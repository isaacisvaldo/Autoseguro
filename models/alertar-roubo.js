const Sequelize = require("sequelize");
const connection = require("../database/database");
const User = require("./User");

const Alertarroubo = connection.define('alertarroubo',{
      descricao:{
          type:Sequelize.STRING,
          allowNull:false
       },
     matricula:{
        type:Sequelize.STRING,
        allowNull:false
     },
     documento:{
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
 createdAt:{
   type:Sequelize.DATEONLY,
   allowNull:false
},
updatedAt:{
 type:Sequelize.DATEONLY,
 allowNull:false
}
  
   
});
User.hasMany(Alertarroubo,{
   onDelete:'Cascade'  
  });
  Alertarroubo .belongsTo(User);

//Alertarroubo.sync({force:true});
module.exports = Alertarroubo;