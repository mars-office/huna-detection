import { Request, Response, Router } from "express";
import { gridFsBucket } from "../services/mongodb.service";
import {v4} from 'uuid';

const detectRouter = Router();

detectRouter.post("/api/detection/detect", (req: Request, res: Response) => {
  const parkingLotId = (req as any).user.sub;
  const now = new Date().getTime();
  const writeStream = gridFsBucket.openUploadStream(`${parkingLotId}_${now}_${v4()}.rgb565`, {
    metadata: {
      parkingLotId,
      type: 'jpg',
      createdAt: now
    }
  });
  writeStream.on('error', (e) => {
    writeStream.end();
    console.error(e);
    res.status(500).send({global: ['api.detection.detect.uploadError']});
  });
  writeStream.on('close', () => {
    res.send({success: true, _id: writeStream.id});
    
  });
  req.pipe(writeStream);
});

export default detectRouter;
