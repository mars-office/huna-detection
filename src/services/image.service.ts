import sharp from "sharp";

export const imageService = {
  convertRGB565BufferToJpegBuffer: async (
    buffer: Buffer,
    width: number,
    height: number
  ) => {
    const pixelCount = width * height;
    const outputBuffer = Buffer.alloc(pixelCount * 3);

    for (let i = 0, j = 0; i < pixelCount * 2; i += 2, j += 3) {
      const pixel16bit = buffer.readUInt16LE(i);
      const r = ((pixel16bit >> 11) & 0x1f) << 3;
      const g = ((pixel16bit >> 5) & 0x3f) << 2;
      const b = (pixel16bit & 0x1f) << 3;

      outputBuffer[j] = r;
      outputBuffer[j + 1] = g;
      outputBuffer[j + 2] = b;
    }

    return sharp(outputBuffer, {
      raw: {
        width: width,
        height: height,
        channels: 3,
      },
    })
      .toFormat("jpeg", {
        quality: 100
      } as sharp.JpegOptions)
      .toBuffer();
  },
};

export default imageService;
