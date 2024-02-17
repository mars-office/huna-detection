import { Request, Response, Router } from "express";

const detectRouter = Router();

detectRouter.post("/api/detection/detect", (req: Request, res: Response) => {
  console.log((req as any).user);
  res.send("OK");
});

export default detectRouter;