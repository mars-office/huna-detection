import { Request, Response, Router } from "express";

const healthCheckRouter = Router();

healthCheckRouter.get("/api/detection/health", (_: Request, res: Response) => {
  res.send("OK: " + process.env.DEPLOYABLE_VERSION || 'local');
});

export default healthCheckRouter;