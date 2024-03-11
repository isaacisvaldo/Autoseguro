
function marcamodelo(s1,s2){
 var s1 = document.getElementById(s1);
 var s2 = document.getElementById(s2);

 s2.innerHTML = "";
 if(s1.value == 'TOYOTA'){
          var optionArray = ["Camry|Camry ", "Corolla|Corolla" ,"Etios|Etios", "Hatch|Hatch", " Etios|Etios" ,"Sedã|Sedã" , "Hilux|Hilux" ,"Prius" , "RAV4|RAV4" ,"SW4|SW4"];
         }else if(s1.value == 'AGRALE'){
          var optionArray = ['Agrale – Trator|Agrale – Trator' ,'Agrale Caminhão|Agrale Caminhão' , 'Agrale – Ônibus|Agrale – Ônibus'];
       } else if(s1.value == 'ASTON MARTIN'){
          var optionArray = ['DB9 Volante|DB9 Volante' , 'DBS Coupe|DBS Coupe' , 'DBS Volante|DBS Volante ', 'Rapide|Rapide' ,'V12 Vantage Coupe|V12 Vantage Coupe' , 'V8 Vantage Coupe|V8 Vantage Coupe' , 'V8 Vantage Roadster|V8 Vantage Roadster' , 'Virage|Virage'];
       }else if(s1.value == 'AUDI'){
         var optionArray = ['A1','|A3 Sedan', '|A3' , '|A4 Avant' , '|A4 Sedan ','|A5 ', '|A7' , '|A8' , '|Q3' , '|Q5' , '|Q7 ', 'R8|R8 ',' R8 GT|R8 GT ', 'RS 3 Sportback|RS 3 Sportback' ,'RS5|RS5' , 'RS6 Avant|RS6 Avant' , 'TT Coupe|TT Coupe' , 'TT Roadster|TT Roadster'];

      }else if(s1.value == 'BENTLEI'){
         var optionArray = ['Continental GT|Continental GT', 'Continental GTC|Continental GTC' , 'Continental Flying Spur|Continental Flying Spur' , 'Azure |Azure ', 'Arnage|Arnage', 'Mulsanne |Mulsanne ', 'Bentley Brooklands|Bentley Brooklands' , 'Bentley Hunaudieres|Bentley Hunaudieres' , 'Silver Wings'];

      }else if(s1.value == 'BMW'){
         var optionArray = ['Série 1 |Série 1 ','Série 1 Cabrio|Série 1 Cabrio'  ,'Série 1 Coupé|Série 1 Coupé ',' Série 1 M|Série 1 M' , 'Série 3 Cabrio|Série 3 Cabrio' , 'Série 3 M3 Coupé|Série 3 M3 Coupé', 'Série 3 Sedã|Série 3 Sedã' , 'Série 5 Gran Turismo|Série 5 Gran Turismo' ,'Série 5 Sedã|Série 5 Sedã' ,' Série 7 Sedã|Série 7 Sedã' , 'X1|X1', 'X3|X3'  ,'X5|X5' , 'X6|X6', 'Z4 Roadster|Z4 Roadster','i3|i3'];

      }else if(s1.value == 'BUGATTI'){
         var optionArray = ['Bugatti Type 13|Bugatti Type 13','Bugatti Type 101|Bugatti Type 101' , 'Bugatti EB110 |Bugatti EB110 ', 'Bugatti EB112'  ,'Bugatti EB218|Bugatti EB218' , 'Bugatti Veyron|Bugatti Veyron' , 'Bugatti Chiron|Bugatti Chiron'];

      }else if(s1.value == 'CHANGAN'){
         var optionArray = ['Chana Cargo|Chana Cargo',  'Chana Family|Chana Family',  'Chana Utility|Chana Utility'];

      }else if(s1.value == 'GM/CHEVROLET'){
         var optionArray = ['Agile |Agile ','Astra Hatch|Astra Hatch ', 'Astra Sedan|Astra Sedan ', 'Blazer|Blazer','Camaro|Camaro' ,'Captiva|Captiva' , 'Celta |Celta ', 'Classic|Classic' ,'Cobalt |Classic', 'Corsa Hatch |Corsa Hatch ', 'Corsa Sedã|Corsa Sedã ','Zafira|Zafira' ,'Vectra GT|Vectra GT','Trailblazer|Trailblazer'];

      }else if(s1.value == 'FERRARI'){
         var optionArray = ['458|458 ', 'California|California ','F599 GTO|F599 GTO'];

      }

     

for(var option in optionArray){
var pair = optionArray[option].split("|");
var newoption = document.createElement("option");

newoption.value = pair[0];
newoption.innerHTML=pair[1];
s2.options.add(newoption);
}
}
