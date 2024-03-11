const Sequelize = require("sequelize");
const connection = require("../database/database");
const User = require("./User");

const Apolice = connection.define('apolice', {

   plano_desejado:{
      type: Sequelize.STRING,
      allowNull: false
   },
  dias: {
      type: Sequelize.INTEGER,
      allowNull: false
   },
   matricula: {
      type: Sequelize.STRING,
      allowNull: false
   },
    franquia: {
      type: Sequelize.STRING,
      allowNull: false
   },
  tipo_seguro:{
      type:Sequelize.STRING,
      allowNull:false,
      
   },
secret:{
   type:Sequelize.STRING,
   allowNull:false,
   
},

marca:{
   type:Sequelize.STRING,
   allowNull:false,
   
},
dia_inicio:{
   type:Sequelize.DATEONLY,
   allowNull:false,
   
},
dia_fim:{
   type:Sequelize.DATEONLY,
   allowNull:false,
   
},
valor:{
   type: Sequelize.INTEGER,
   allowNull: false
},
estado:{
   type:Sequelize.TINYINT,
   allowNull:false,
   
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
User.hasMany(Apolice, {
   onDelete: 'Cascade'
});
Apolice.belongsTo(User);

//Apolice.sync({force:true});
module.exports = Apolice;