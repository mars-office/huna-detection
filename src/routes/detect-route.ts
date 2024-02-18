import { Request, Response, Router } from "express";
import { gridFsBucket } from "../services/mongodb.service";
import {v4} from 'uuid';
import { mqttClient } from "../services/mqtt.service";

const detectRouter = Router();

detectRouter.post("/api/detection/detect", (req: Request, res: Response) => {
  const parkingLotId = (req as any).user.sub;
  const now = new Date().getTime();
  const writeStream = gridFsBucket.openUploadStream(`${parkingLotId}_${now}_${v4()}.rgb565`, {
    metadata: {
      parkingLotId,
      type: 'jpg',
      createdAt: now,
      width: req.query["width"] ? +req.query["width"] : 320,
      height: req.query["height"] ? +req.query["height"] : 240,
    }
  });
  writeStream.on('error', (e) => {
    writeStream.end();
    console.error(e);
    res.status(500).send({global: ['api.detection.detect.uploadError']});
  });
  writeStream.on('close', () => {
    res.send({success: true, _id: writeStream.id});
    mqttClient.publish('processing', writeStream.id.toString(), {
      qos: 0
    });
  });
  req.pipe(writeStream);
});

export default detectRouter;
