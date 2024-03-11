const Sequelize = require("sequelize");
const connection = require("../database/database");
const User = require("./User");

const Veiculo = connection.define('veiculo',{
   tipo:{
      type:Sequelize.STRING,
      allowNull:false
   },  
   marca:{
          type:Sequelize.STRING,
          allowNull:false
       },
       modelo:{
        type:Sequelize.STRING,
        allowNull:false
     },
     cor:{
      type:Sequelize.STRING,
      allowNull:false
   },servico:{
    type:Sequelize.STRING,
    allowNull:false
 },

   lotacao:{
      type:Sequelize.INTEGER,
      allowNull:false
   },
   cilindrada:{
      type:Sequelize.STRING,
      allowNull:false
   },
   numero_quadro:{
      type:Sequelize.STRING,
      allowNull:false
   },
   combustivel:{
      type:Sequelize.STRING,
      allowNull:false
   },peso:{
      type:Sequelize.STRING,
      allowNull:false
   },
   tara:{
      type:Sequelize.STRING,
      allowNull:false
   },
   tipo_caixa:{
      type:Sequelize.STRING,
      allowNull:false
   },
   distancia_eixo:{
      type:Sequelize.INTEGER,
      allowNull:false
   },
   medidas_pneus:{
      type:Sequelize.STRING,
      allowNull:false
   },
     matricula:{
        type:Sequelize.STRING,
        allowNull:false,
        unique:true
     },
     
     numero_motor:{
        type:Sequelize.STRING,
        allowNull:false,
        unique:true
     },
     numero_cilindro:{
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
User.hasMany(Veiculo,{
   onDelete:'Cascade'  
  });
Veiculo.belongsTo(User);

//Veiculo.sync({force:true});
module.exports = Veiculo;