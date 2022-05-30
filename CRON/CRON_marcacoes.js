const cron = require('node-cron');


function updateDate(){
 const Marcacoes = require('../models/Marcacoes');
    Marcacoes.findAll({
         where:{
             estado: 0
         }
    }).then( marc =>{
        if(marc){
            marc.map(element => {
                if( element.data_marcacao == 0){
                   
                 Marcacoes.update({estado:2}, {
                    where: {
                       id: element.id
                    }
                    }).then(()=>{
                        
                        console.log("Mudaste o estado")
                    })
                    
                }else{
                    var novo = (element.data_marcacao - 1);
                   
                    Marcacoes.update({data_marcacao:novo}, {
                        where: {
                           id: element.id
                        }
                        }).then(()=>{
                            console.log("Mudaste oo dia")
                        })
                }
                
            });
        }else{
            console.log("Não tem Marcações")
        }
      
    })
}

module.exports = cron.schedule('* */1440  * * *', updateDate,{
schedule:false

});