import express from "express";
import { config } from "dotenv";
import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerOptions from "./config/swaggerOptions";
import { routes} from "./routes";
import flash from "express-flash";
// import RedisStore from "connect-redis"
import session, { SessionOptions } from 'express-session';
// import {createClient} from "redis"
import bodyParser from "body-parser";
import cors from "cors";
// const redisClient = createClient()
// redisClient.connect().catch(console.error)
// const redisStore = new RedisStore({
//   client: redisClient,
//   prefix: "myapp:",
// })
config();
const main = async () => {
  const app = express();
  app.use(flash());
  app.use(
    session({
    //  store: redisStore,
      secret: process.env.SESSION_PASSWORD || "Testando@##123",
      resave: false,
      saveUninitialized: false,
      cookie: {
        secure:false,
        maxAge: 60 * 60 * 1000, 
      },
    } as SessionOptions));
  app.set("view engine", "ejs");
  app.use(express.static("public"));
  app.use(express.json());
  app.use(cors());
  app.use(bodyParser.urlencoded({ extended: false }));
  const swaggerSpec = swaggerJsdoc(swaggerOptions);
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
  app.use(express.json());
  app.use(routes)
  const port = process.env.PORT || 8085;
  app.use(function  (req,res,next){
   res.send("Page not found!")
}) 
  app.listen(port, () => console.log(`http://localhost:${port}`));
};
main();