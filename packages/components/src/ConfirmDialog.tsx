import { AIRole, AIState, createAIAttributes } from "@domglyph/ai-contract";
import { Box, DialogBase, Stack, Text } from "@domglyph/primitives";
import { useId } from "react";

import { ActionButton } from "./ActionButton";
import type { ConfirmDialogProps } from "./types";

export function ConfirmDialog({
  aiId,
  cancelAction,
  cancelLabel = "Cancel",
  confirmAction,
  confirmLabel = "Confirm",
  description,
  onCancel,
  onConfirm,
  open,
  title,
  ...dialogProps
}: ConfirmDialogProps): JSX.Element {
  const titleId = useId();
  const descriptionId = useId();

  return (
    <DialogBase
      {...dialogProps}
      ariaDescribedBy={description ? descriptionId : undefined}
      ariaLabelledBy={titleId}
      open={open}
      {...createAIAttributes({
        id: aiId,
        role: AIRole.MODAL,
        state: open ? AIState.EXPANDED : AIState.IDLE
      })}
    >
      <Stack gap="1rem">
        <Box>
          <Text as="h2" id={titleId} style={{ fontSize: "1.125rem", fontWeight: 700 }}>
            {title}
          </Text>
          {description ? (
            <Text as="p" id={descriptionId} tone="muted">
              {description}
            </Text>
          ) : null}
        </Box>
        <Stack direction="row" gap="0.75rem" justify="flex-end">
          <ActionButton
            action={cancelAction}
            aiId={`${aiId}-cancel`}
            aiState={AIState.IDLE}
            onClick={onCancel}
            style={{
              background: "transparent",
              color: "var(--domglyph-foreground)"
            }}
          >
            {cancelLabel}
          </ActionButton>
          <ActionButton
            action={confirmAction}
            aiId={`${aiId}-confirm`}
            aiState={AIState.IDLE}
            onClick={onConfirm}
          >
            {confirmLabel}
          </ActionButton>
        </Stack>
      </Stack>
    </DialogBase>
  );
}
