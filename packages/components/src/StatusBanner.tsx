import {
  AIEvent,
  AIRole,
  AIState,
  DATA_AI_EVENT,
  DATA_AI_STATUS,
  createAIAttributes
} from "@domglyph/ai-contract";
import { Box, Stack, Text, primitiveVars } from "@domglyph/primitives";
import type { CSSProperties } from "react";

import type { StatusBannerProps } from "./types";

const bannerTone: Record<StatusBannerProps["status"], CSSProperties> = {
  error: {
    borderLeft: `4px solid var(${primitiveVars.dangerColor})`
  },
  info: {
    borderLeft: `4px solid var(${primitiveVars.foreground})`
  },
  success: {
    borderLeft: `4px solid var(${primitiveVars.successColor})`
  }
};

export function StatusBanner({
  aiId,
  children,
  className,
  event = AIEvent.ACTION_COMPLETED,
  status,
  style,
  title
}: StatusBannerProps): JSX.Element {
  const normalizedState =
    status === "error"
      ? AIState.ERROR
      : status === "success"
        ? AIState.SUCCESS
        : AIState.IDLE;

  const aiAttributes = createAIAttributes({
    event,
    id: aiId,
    role: AIRole.STATUS,
    state: normalizedState,
    status
  });

  return (
    <Box
      {...aiAttributes}
      aria-live={status === "error" ? "assertive" : "polite"}
      className={className}
      role={status === "error" ? "alert" : "status"}
      style={{
        background: "color-mix(in srgb, var(--domglyph-surface) 92%, white)",
        border: "1px solid var(--domglyph-border-color)",
        borderRadius: "var(--domglyph-radius)",
        padding: "0.875rem 1rem",
        ...bannerTone[status],
        ...style
      }}
    >
      <Stack gap="0.25rem">
        {title ? (
          <Text as="p" style={{ fontWeight: 600 }}>
            {title}
          </Text>
        ) : null}
        <Text as="p">{children}</Text>
      </Stack>
    </Box>
  );
}

export { DATA_AI_EVENT, DATA_AI_STATUS };
