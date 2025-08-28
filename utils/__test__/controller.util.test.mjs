import { beforeEach, describe, expect, it } from "vitest";
import { transformTextToPreview } from "../controller.util";

describe("Controller utilities", () => {
  describe("transformTextToPreview utility", () => {
    const posts = [
      {
        title: "Long post",
        text: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Error molestiae labore, beatae illum nemo iusto vel neque aperiam maiores voluptates quisquam, reiciendis esse odit assumenda aliquam quaerat nesciunt dignissimos et. Maxime nesciunt autem possimus ducimus mollitia quibusdam nostrum corrupti explicabo nemo veniam quaerat, nobis esse perferendis, expedita aspernatur non magnam consequuntur doloremque similique?",
      },
      {
        title: "Short post",
        text: "Yes",
      },
      {
        title: "Another short post",
        text: "foo bar pizza hungry",
      },
    ];
    let result;

    beforeEach(() => {
      result = transformTextToPreview(posts);
    });

    it("translates 'text' to 'preview' field", () => {
      result.forEach((resultPost) => {
        expect(resultPost.text).toBeUndefined();
        expect(resultPost.preview).toBeTruthy();
      });
    });

    it("truncates 'text' field to shorter versions if under 300 characters", () => {
      result.forEach((resultPost) => {
        const ellipsisLength = "...".length;

        expect(resultPost.preview.length).toBeLessThanOrEqual(
          300 + ellipsisLength,
        );
      });
    });

    it("keeps posts structure aside from 'text' field", () => {
      for (let i = 0; i < posts.length; i++) {
        const { text, ...restPost } = posts[i];
        const { preview, ...restResult } = result[i];

        if (text.length === preview.length) {
          expect(text).toBe(preview);
        }

        expect(restPost).toEqual(restResult);
      }
    });
  });
});
