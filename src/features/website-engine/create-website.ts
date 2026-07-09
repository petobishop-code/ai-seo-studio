import { WebsiteInput, WebsiteResult } from "./types";
import { createDrainWebsite } from "./industries/drain/create-drain-website";

export function createWebsite(input: WebsiteInput): WebsiteResult {
  if (input.industry === "하수구/배관" || !input.industry) {
    return createDrainWebsite(input);
  }

  return createDrainWebsite(input);
}