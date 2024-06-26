import { SNSClient, PublishCommand } from "@aws-sdk/client-sns";

export async function sendEmail(error, topicArn = process.env.EMAIL_TOPIC) {
  const client = new SNSClient({});

  try {
    const response = await client.send(
      new PublishCommand({
        Message:
          "Error occured while converting to thumbnail: " + error.message,
        TopicArn: topicArn,
      })
    );

    console.log(response);
  } catch (error) {
    console.log("Error while sending email notification", error);
  }
}
