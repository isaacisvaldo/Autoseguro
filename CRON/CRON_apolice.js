const cron = require('node-cron');



function updateDate(){
    const Apolice = require('../models/Apolice');
    Apolice .findAll({
         where:{
             estado: 1
         }
    }).then( marc =>{

      marc.map(element =>{
          if(element.dias == 0){
            Apolice.update({estado:2}, {
                where: {
                   id: element.id
                }
                }).then(()=>{
                    console.log("Mudaste o estado")
                })
          }else{
            var novo = (element.dias - 1);
                   
            Apolice.update({dias:novo}, {
                 where: {
                    id: element.id
                 }
                 }).then(()=>{
                     console.log("Mudaste o dia")
                 })
           
          }
        
    
      })
      
    })
}

module.exports = cron.schedule('* */1440  * * *', updateDate,{
schedule:false

});