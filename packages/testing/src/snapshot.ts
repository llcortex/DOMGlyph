import { extractAIAttributes } from "@domglyph/ai-contract";

import type { MetadataSnapshot } from "./types";

export function createMetadataSnapshot(
  target: string,
  element: Parameters<typeof extractAIAttributes>[0]
): MetadataSnapshot {
  return {
    attributes: extractAIAttributes(element),
    target
  };
}

export function serializeMetadataSnapshot(snapshot: MetadataSnapshot): string {
  return JSON.stringify(snapshot, null, 2);
}
