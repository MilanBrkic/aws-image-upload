import { getSignedUrlHandler } from "../../../src/handlers/get-signed-url.mjs";

// This includes all tests for getSignedUrlHandler()
describe("Test getSignedUrlHandler", () => {
  it("happy path", async () => {
    const event = {
      httpMethod: "GET",
      queryStringParameters: {
        filename: "new-image.png",
        type: "png",
      },
    };

    // Invoke getSignedUrlHandler()
    const result = await getSignedUrlHandler(event);

    // Compare the result with the expected result
    expect(result.statusCode).toEqual(200);
    expect(result.body.link).not.toEqual(null);
  });

  it("No queries in request", async () => {
    const event = {
      httpMethod: "GET",
      queryStringParameters: null,
    };

    // Invoke getSignedUrlHandler()
    const result = await getSignedUrlHandler(event);

    // Compare the result with the expected result
    expect(result.statusCode).toEqual(404);
  });

  it("No filename in request", async () => {
    const event = {
      httpMethod: "GET",
      queryStringParameters: {},
    };

    // Invoke getSignedUrlHandler()
    const result = await getSignedUrlHandler(event);

    // Compare the result with the expected result
    expect(result.statusCode).toEqual(404);
  });

  it("No filename in request", async () => {
    const event = {
      httpMethod: "GET",
      queryStringParameters: {},
    };

    // Invoke getSignedUrlHandler()
    const result = await getSignedUrlHandler(event);

    // Compare the result with the expected result
    expect(result.statusCode).toEqual(404);
  });

  it("happy path", async () => {
    const event = {
      httpMethod: "GET",
      queryStringParameters: {
        filename: "new-image.pdf",
      },
    };

    // Invoke getSignedUrlHandler()
    const result = await getSignedUrlHandler(event);

    // Compare the result with the expected result
    expect(result.statusCode).toEqual(404);
  });
});
