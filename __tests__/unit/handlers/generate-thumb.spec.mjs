import { resizeImage } from "../../../src/handlers/generate-thumb.mjs";
import fs from "fs";
const testDataPath = "./__tests__/test-data";
// failing test
describe("Test generateThumb", () => {
  describe("resizeImage", () => {
    it("Resize", async () => {
      const buff = fs.readFileSync(testDataPath + "/test-img.jpg");
      const resized = await resizeImage(buff);

      fs.writeFileSync(testDataPath + "/test-img-resize.jpg", resized);

      expect(buff.byteLength > resized.byteLength).toEqual(true);
    });
  });
});
