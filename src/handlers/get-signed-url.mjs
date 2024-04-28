import { S3, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { randomUUID } from "crypto";
import { getResponse } from "../util.mjs";

const region = process.env.FULL_RES_BUCKET_NAME ?? "eu-central-1";
const bucketName = process.env.FULL_RES_BUCKET_NAME ?? "full-res-image-bucket";

const s3 = new S3({
  region,
});

const allowedExtensions = ["jpg", "jpeg", "png", "svg", "gif"];

export async function getSignedUrlHandler(event) {
  console.log(event);
  const filename = event.queryStringParameters?.filename;

  if (!filename) {
    return getResponse(400, { message: "No filename in query" });
  }

  const extension = getExtension(filename);

  if (!allowedExtensions.includes(extension)) {
    return getResponse(400, {
      message: "File is either not an image or of unsupported type",
      allowedTypes: allowedExtensions,
    });
  }

  try {
    const link = await getUrl(filename);
    return getResponse(200, { link });
  } catch (error) {
    console.log(error);
    return getResponse(500, { error });
  }
}

async function getUrl(originalName) {
  try {
    const key = `${randomUUID()}`;

    const command = new PutObjectCommand({
      Bucket: bucketName,
      Key: key,
      Metadata: {
        originalName,
      },
    });

    return await getSignedUrl(s3, command, { expiresIn: 3600 });
  } catch (error) {
    console.error("Error getting signed URL:", error);
    throw error;
  }
}

function getExtension(filename) {
  return filename.substring(filename.lastIndexOf(".") + 1);
}
