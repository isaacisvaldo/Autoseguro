const cron = require('node-cron');

function   updateDate(){
    const Notificacao = require('../models/Notificacao');
   Notificacao.findAll({
         where:{
             estado: 0
         }
    }).then( marc =>{

      marc.map(element =>{
          if(element.estado == 0){
           Notificacao.update({estado:2}, {
                where: {
                   id: element.id
                }
                }).then(()=>{
                console.log("Mudaste o estado")
                })
          }
        
    
      })
      
    })
}

module.exports = cron.schedule('* */1440  * * *', updateDate,{
schedule:false

});