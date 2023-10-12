import http from "http";
import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import "dotenv/config";
import sequelize from "./utils/db-connection";
import indexRouter from "./routes/index";
import moment from "moment-timezone";
import connectionLogServices from "./services/connectionLog";
import { initIO } from "./utils/socket";
import { ConnectionLogsAttributes } from "./types/connectionLog";
const port = process.env.PORT || 3000;

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = initIO(server);

io.on("connection", (socket: any) => {
  console.log(`User connected ${socket?.id}`);
  socket.on("disconnect", function () {
    console.log("User disconnected");
  });
});

app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));
app.use(express.json());

// connect and sync all the db tables with models on initial start.
// sequelize.sync();
sequelize
  .authenticate()
  .then(async () => {
    try {
      console.log("Connected to the database successfully.");

      // Get the current timestamp in Pacific Time
      const currentTime = moment()
        .tz("America/Los_Angeles")
        .format("dddd [at] h:mm A");

      // Log the connection timestamp
      console.log(`Connected on ${currentTime} Pacific Time.`);
      const connectionObj: Partial<ConnectionLogsAttributes> = {
        message: `Connected on ${currentTime} Pacific Time.`,
      };
      await connectionLogServices.createConnectionLog(connectionObj);
    } catch (error) {
      console.log(error, "error");
    }
  })
  .catch((err) => {
    console.error("Unable to connect to the database:", err);
  });

app.use("/", indexRouter);

server.listen(port, () => {
  console.log(`Server started on Port: ${port}`);
});
