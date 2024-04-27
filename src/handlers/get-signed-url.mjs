import { S3, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { randomUUID } from "crypto";

const region = "eu-central-1";

const s3 = new S3({
  region: region,
});

const bucketParams = {
  Bucket: "full-res-image-bucket",
};

const allowedCorsHeaders = {
  "Access-Control-Allow-Headers": "*",
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "*",
};

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

async function getUrl(filename) {
  try {
    const extension = getExtension(filename);
    const key = `${randomUUID()}.${extension}`;

    const command = new PutObjectCommand({
      ...bucketParams,
      Key: key,
      Metadata: {
        originalName: filename,
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

function getResponse(statusCode, body) {
  return {
    statusCode,
    headers: allowedCorsHeaders,
    body: JSON.stringify(body),
  };
}
