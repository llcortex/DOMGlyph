import { AIRole, AIState, createAIAttributes } from "@domglyph/ai-contract";
import { Box, InputBase, Stack, Text } from "@domglyph/primitives";
import { useId } from "react";

import type { FormFieldProps } from "./types";

export function FormField({
  disabled,
  error,
  fieldId,
  fieldType,
  hint,
  label,
  required = false,
  successMessage,
  ...inputProps
}: FormFieldProps): JSX.Element {
  const hintId = useId();
  const errorId = useId();
  const successId = useId();
  const describedBy = [hint ? hintId : null, error ? errorId : null, successMessage ? successId : null]
    .filter(Boolean)
    .join(" ");

  const states = [
    disabled ? AIState.DISABLED : AIState.IDLE,
    error ? AIState.ERROR : successMessage ? AIState.SUCCESS : AIState.IDLE
  ];

  const aiAttributes = createAIAttributes({
    feedback: typeof error === "string" ? error : undefined,
    fieldType,
    id: fieldId,
    required,
    role: AIRole.FIELD,
    state: Array.from(new Set(states))
  });

  return (
    <Stack gap="0.375rem">
      <Text as="label" htmlFor={fieldId} tone="default">
        {label}
        {required ? (
          <Text as="span" tone="danger">
            {" "}
            *
          </Text>
        ) : null}
      </Text>
      <InputBase
        {...inputProps}
        {...aiAttributes}
        aria-describedby={describedBy || undefined}
        disabled={disabled}
        id={fieldId}
        invalid={Boolean(error)}
        required={required}
        type={fieldType}
      />
      {hint ? (
        <Text as="p" id={hintId} tone="muted">
          {hint}
        </Text>
      ) : null}
      {error ? (
        <Box
          aria-live="polite"
          id={errorId}
          {...createAIAttributes({
            feedback: typeof error === "string" ? error : undefined,
            id: `${fieldId}-error`,
            role: AIRole.STATUS,
            state: AIState.ERROR
          })}
        >
          <Text as="p" tone="danger">
            {error}
          </Text>
        </Box>
      ) : null}
      {!error && successMessage ? (
        <Box
          aria-live="polite"
          id={successId}
          {...createAIAttributes({
            feedback: typeof successMessage === "string" ? successMessage : undefined,
            id: `${fieldId}-success`,
            role: AIRole.STATUS,
            state: AIState.SUCCESS
          })}
        >
          <Text as="p" tone="success">
            {successMessage}
          </Text>
        </Box>
      ) : null}
    </Stack>
  );
}
