import { generateThumb } from "../../../src/handlers/generate-thumb.mjs";
import putTestData from "../../test-data/put-object.json";
import { mockClient } from "aws-sdk-client-mock";
import { S3Client } from "@aws-sdk/client-s3";

const mock = mockClient(S3Client);

// failing test
describe("Test generateThumb", () => {
  beforeEach(() => {
    mock.reset();
  });

  it("happy path", async () => {
    const result = await generateThumb(putTestData);
    console.log(result);
    expect(result.statusCode).toEqual(200);
  });
});
