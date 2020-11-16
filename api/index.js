import config from "dotenv";
import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import swaggerUi from "swagger-ui-express";
import swagger from "./swagger";
import FileRoutes from "./server/routes/FileRoutes";

config.config();

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

/**
 * Route to Swagger API documentation.
 */
app.use("/api/v1/api-docs", swaggerUi.serve, swaggerUi.setup(swagger));

/**
 * Route to handle all the File operations.
 */
app.use("/api/v1/files", FileRoutes);

/**
 * when a random route is inputed
 */
app.get("*", (req, res) =>
  res.status(404).send({
    message: "Not Found.",
  })
);

const port = process.env.PORT || 8000;
app.listen(port, () => {
  console.log(`Server is running on PORT ${port}`);
});

export default app;
