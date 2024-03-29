import './services/env.loader';
import express, { Application } from "express";
import morgan from "morgan";
import opaAuthzMiddleware from "./middlewares/opa-authz.middleware";
import globalErrorHandlerMiddleware from "./middlewares/global-error-handler.middleware";
import healthCheckRouter from "./routes/health-check.route";
import detectRouter from './routes/detect-route';
import './services/mqtt.service';

const env = process.env.NODE_ENV || "local";
const app: Application = express();
app.use(express.json());
app.use(morgan(
  env === "local" ? "dev" : "common"
));

// Public routes
app.use(healthCheckRouter);

// Secure routes
app.use(opaAuthzMiddleware);


app.use(detectRouter);

// Error handler, should always be LAST use()
app.use(globalErrorHandlerMiddleware);

app.listen(3004, () => {
  console.log(`Server is listening on http://localhost:3004`);
});

process.on("SIGINT", () => {
  process.exit();
});
