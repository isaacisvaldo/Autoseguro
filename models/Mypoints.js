const Sequelize = require("sequelize");
const connection = require("../database/database");



const Mypoints = connection.define('mypoints',{
   name:{
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
     whatsapp:{
        type:Sequelize.INTEGER,
        allowNull:false
     },
    descricao:{
        type:Sequelize.TEXT,
        allowNull:false
     },
     entidade:{
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


 
//Mypoints.sync({force:true});
module.exports = Mypoints;