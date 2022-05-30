const Sequelize = require("sequelize");
const connection = require("../database/database");
const User = require("./User");

const Local = connection.define('local',{
      provincia:{
          type:Sequelize.STRING,
          allowNull:false
       },
       municipio:{
        type:Sequelize.STRING,
        allowNull:false
     }
       
});
User.hasMany(Local,{
 onDelete:'Cascade'  
});
Local.belongsTo(User);

//Local.sync({force:true});
module.exports = Local;