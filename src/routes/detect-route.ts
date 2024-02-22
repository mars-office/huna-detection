import { Request, Response, Router } from "express";
import imageService from "../services/image.service";

const detectRouter = Router();

detectRouter.post("/api/detection/detect", (req: Request, res: Response) => {
  const parkingLotId = (req as any).user.sub;
  const width = req.query["width"] ? +req.query["width"] : 320;
  const height = req.query["height"] ? +req.query["height"] : 240;
  const buffers: Buffer[] = [];

  req.on("error", (e) => {
    console.error(e);
    res.status(500).send({ global: ["api.detection.detect.uploadError"] });
  });

  req.on("data", (d) => {
    buffers.push(d);
  });

  req.on("end", () => {
    const mergedBuffers = Buffer.concat(buffers);
    res.send({ success: true });
    res.end();
    setTimeout(() => {
      (async () => {
        try {
          const jpegBuffer = await imageService.convertRGB565BufferToJpegBuffer(
            mergedBuffers,
            width,
            height
          );
          console.log(jpegBuffer); //TODO
        } catch (err) {
          console.error(err);
        }
      })();
    });
  });
});

export default detectRouter;
