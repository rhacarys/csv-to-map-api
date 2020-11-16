import config from "dotenv";
import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import swaggerUi from "swagger-ui-express";
import swagger from "../swagger.json";
import FileRoutes from "./server/routes/FileRoutes";

config.config();

const app = express();
const apiDocs = "/api/v1/api-docs";

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

/**
 * Route to handle all the File operations.
 */
app.use("/api/v1/files", FileRoutes);

/**
 * Route to Swagger API documentation.
 */
app.use(apiDocs, swaggerUi.serve, swaggerUi.setup(swagger));

/**
 * When a random route is inputed, redirect to the current API documentation.
 */
app.get("*", (req, res) => res.redirect(apiDocs));

const port = process.env.PORT || 8000;
app.listen(port, () => {
  console.log(`Server is running on PORT ${port}`);
});

export default app;
