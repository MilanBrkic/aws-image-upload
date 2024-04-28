import { getSignedUrlHandler } from "../../../src/handlers/get-signed-url.mjs";

describe("Test getSignedUrlHandler", () => {
  it("happy path", async () => {
    const event = {
      httpMethod: "GET",
      queryStringParameters: {
        filename: "new-image.png",
        type: "png",
      },
    };

    const result = await getSignedUrlHandler(event);

    expect(result.statusCode).toEqual(200);
    expect(result.body.link).not.toEqual(null);
  });

  it("No queries in request", async () => {
    const event = {
      httpMethod: "GET",
      queryStringParameters: null,
    };

    const result = await getSignedUrlHandler(event);

    expect(result.statusCode).toEqual(400);
  });

  it("No filename in request", async () => {
    const event = {
      httpMethod: "GET",
      queryStringParameters: {},
    };

    const result = await getSignedUrlHandler(event);

    expect(result.statusCode).toEqual(400);
  });

  it("No filename in request", async () => {
    const event = {
      httpMethod: "GET",
      queryStringParameters: {},
    };

    const result = await getSignedUrlHandler(event);

    expect(result.statusCode).toEqual(400);
  });

  it("invalid image format", async () => {
    const event = {
      httpMethod: "GET",
      queryStringParameters: {
        filename: "new-image.pdf",
      },
    };

    const result = await getSignedUrlHandler(event);

    expect(result.statusCode).toEqual(400);
  });
});
