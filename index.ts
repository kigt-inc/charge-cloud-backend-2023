import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import "dotenv/config";
import sequelize from "./utils/db-connection";
import indexRouter from "./routes/index";
const port = process.env.PORT || 3000;

const app = express();

app.use(cors());
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));
app.use(express.json());

// connect and sync all the db tables with models on initial start.
sequelize.sync();
sequelize.authenticate();

app.use("/", indexRouter);

app.listen(port, () => {
  console.log(`Server started on Port: ${port}`);
});
