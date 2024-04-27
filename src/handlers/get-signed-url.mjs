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

export async function getSignedUrlHandler(event) {
  console.log(event);
  const { filename } = event.queryStringParameters;

  try {
    const link = await getUrl(filename);
    return {
      statusCode: 200,
      headers: allowedCorsHeaders,
      body: JSON.stringify({
        link,
      }),
    };
  } catch (error) {
    console.log(error);
    return {
      statusCode: 500,
      headers: allowedCorsHeaders,
      body: JSON.stringify({
        error,
      }),
    };
  }
}

async function getUrl(filename) {
  try {
    const extension = filename.substring(filename.lastIndexOf(".") + 1);
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
