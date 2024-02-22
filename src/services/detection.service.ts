import { ObjectId } from "mongodb";
import { gridFsBucket } from "./mongodb.service";
import imageService from "./image.service";

export const detectionService = {
  processFile: async (fileId: string) => {
    const fileDocuments = await gridFsBucket.find({_id: new ObjectId(fileId)}, {
      limit: 1
    }).toArray();

    const width: number = fileDocuments[0].metadata!.width;
    const height: number = fileDocuments[0].metadata!.height;

    const readStream = gridFsBucket.openDownloadStream(new ObjectId(fileId));
    
    const buffers: Buffer[] = [];
    readStream.on('error', e => {
      gridFsBucket.delete(new ObjectId(fileId));
      console.error(e);
    });
    readStream.on('data', b => {
      buffers.push(b);
    });
    readStream.on('end', () => {
      (async () => {
        gridFsBucket.delete(new ObjectId(fileId));
        const mergedBuffers = Buffer.concat(buffers);
        const jpegBuffer = await imageService.convertRGB565BufferToJpegBuffer(mergedBuffers, width, height);
        console.log(jpegBuffer); //TODO
      })();
    });
  }
};

export default detectionService;