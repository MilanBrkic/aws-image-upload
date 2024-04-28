import {
  S3Client,
  GetObjectCommand,
  PutObjectCommand,
} from "@aws-sdk/client-s3";
import sharp from "sharp";
import { getResponse } from "../util.mjs";

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
    const { Body, ContentType } = await S3.send(
      new GetObjectCommand({
        Bucket: FULL_RES_BUCKET,
        Key: key,
      })
    );

    console.log("BODY ", Body);

    const image = await Body.transformToByteArray();
    const outputBuffer = await sharp(image).resize(THUMBNAIL_WIDTH).toBuffer();

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

    return getResponse(500, { error });
  }
}
