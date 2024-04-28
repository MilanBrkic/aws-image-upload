import {
  S3Client,
  GetObjectCommand,
  PutObjectCommand,
} from "@aws-sdk/client-s3";
import { getResponse } from "../util.mjs";
import Jimp from "jimp";

const S3 = new S3Client();
const FULL_RES_BUCKET =
  process.env.FULL_RES_BUCKET_NAME ?? "full-res-image-bucket";
const THUMBNAIL_BUCKET =
  process.env.THUMBNAIL_BUCKET ?? "thumbnail-image-bucket";
const THUMBNAIL_WIDTH = 200;

export async function generateThumb(event) {
  console.log(event);

  const record = event.Records[0];
  if (!record?.s3?.object?.key) {
    return getResponse(400, { message: "Event of unexpected type", event });
  }

  const key = record.s3.object.key;

  try {
    console.log("before get");

    const { Body, ContentType, Metadata } = await S3.send(
      new GetObjectCommand({
        Bucket: FULL_RES_BUCKET,
        Key: key,
      })
    );

    console.log("after get");

    console.log("METADATA: " + JSON.stringify(Metadata, null, 2));
    const buff = Buffer.from(await Body.transformToByteArray());
    const outputBuffer = await resizeImage(buff);

    console.log("IMage resized");

    await S3.send(
      new PutObjectCommand({
        Bucket: THUMBNAIL_BUCKET,
        Key: key,
        Body: outputBuffer,
        ContentType,
      })
    );

    const message = `Successfully resized ${FULL_RES_BUCKET}/${key} and uploaded to ${THUMBNAIL_BUCKET}/${key}`;
    console.log(message);
    return getResponse(200, { message });
  } catch (error) {
    console.log(error);

    throw error;
  }
}

export async function resizeImage(buffer) {
  try {
    const image = await Jimp.read(buffer);

    image.resize(THUMBNAIL_WIDTH, Jimp.AUTO);

    const resizedBuffer = await image.getBufferAsync(Jimp.MIME_JPEG);

    return resizedBuffer;
  } catch (error) {
    console.error("Error resizing image:", error);
    throw error;
  }
}
