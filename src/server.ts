import express from "express";
import { config } from "dotenv";
import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerOptions from "./config/swaggerOptions";
import { routes} from "./routes";
import flash from "express-flash";
import bodyParser from "body-parser";
import cors from "cors";

config();
const main = async () => {
  const app = express();
  app.use(flash());
  app.use(express.static("public"));
  app.use(express.json());
  app.use(cors());
  app.use(bodyParser.urlencoded({ extended: false }));
  const swaggerSpec = swaggerJsdoc(swaggerOptions);
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
  app.use(express.json());
  app.use(routes)
  const port = process.env.PORT || 3000;

  app.listen(port, () => console.log(`http://localhost:${port}`));
};
main();
