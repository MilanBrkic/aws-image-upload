// This includes all tests for getSignedUrlHandler()
describe("Test getSignedUrlHandler", () => {
  it("should return ids", async () => {
    const event = {
      httpMethod: "GET",
      queryStringParameters: {
        filename: "new-image.png",
        type: "png",
      },
    };

    // Invoke getSignedUrlHandler()
    const result = await getSignedUrlHandler(event);

    const expectedResult = {
      statusCode: 200,
      body: JSON.stringify(items),
    };

    // Compare the result with the expected result
    expect(result).toEqual(expectedResult);
  });
});
