const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const session = require("express-session");
const flash = require("express-flash");
const cron_marcacoes = require('./CRON/CRON_marcacoes');
const cron_apolice = require('./CRON/CRON_apolice'); 
const CRON_notificacao= require('./CRON/CRON_notificacao'); 
//Controllers
const connection = require("./database/database");
const UserController = require("./controllers/UserController");
const VisitarController = require("./controllers/VisitarControler");
const AdminController = require("./controllers/AdminController");
const TokenPasswordController = require("./controllers/TokenPasswordController");
const TecnicoController = require ("./controllers/TecnicoController");
const cors =require("cors")
const Fundos = require("./models/Fundos") 

// Fim Controllers




//Models
const User = require("./models/User");
const Veiculo = require("./models/Veiculo");
const Notificacao = require("./models/Notificacao");
const Local = require("./models/Local")
const Contacto = require("./models/Contactos");
const Mypoints = require("./models/Mypoints");
const RankNotificacao= require("./models/RankNotificacao");
const Apolice = require("./models/Apolice");
const Marcacoes = require('./models/Marcacoes');
const Registo_login  = require('./models/Registo_login')
const Relatorio_sinistralidade = require('./models/Relatorio_sinistralidade')
const alertarroubo = require('./models/alertar-roubo');
const Documentos = require('./models/Documentos');

const Comprovativo = require('./models/Comprovativo');


// Fim Models





// View engine
app.set('view engine','ejs');


//Sessions
app.use(session({
    secret: "qualquercoisaparaaumentaraseguranç@", cookie: { maxAge: 80000000 },
    saveUninitialized:true,
    resave:true
}))
app.use(flash());

// Static
app.use(express.static('public'));
//Body parser
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
// Database
connection
    .authenticate()
    .then(() => {
        console.log("Conexão feita com sucesso!");
    }).catch((error) => {
        console.log(error);
    })
app.use("/",UserController);
app.use("/",VisitarController);
app.use("/",AdminController);
app.use("/",TokenPasswordController);
app.use("/",TecnicoController)




app.get("/", (req, res) => {
   
   res.render("index",{info:req.flash('info'),certo:req.flash('certo'),errado:req.flash('errado')})

})

app.use(function (req,res,next){
    res.render("error/errors-404")
}) 





app.listen(3000, function (erro) {
    if (erro) {
        console.log(erro);
    } else {
        console.log("Servidor iniciado com sucesso! porta:3000");
    }
})