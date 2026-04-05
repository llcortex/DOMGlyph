import {
  AIRole,
  AIState,
  DATA_AI_ENTITY_ID,
  DATA_AI_FIELD_TYPE,
  createAIAttributes
} from "@domglyph/ai-contract";
import { Box, Text } from "@domglyph/primitives";
import type { CSSProperties } from "react";

import type { DataTableProps, DataTableRow } from "./types";

const tableStyle: CSSProperties = {
  borderCollapse: "collapse",
  width: "100%"
};

const cellStyle: CSSProperties = {
  borderBottom: "1px solid var(--domglyph-border-color)",
  padding: "0.75rem",
  textAlign: "left"
};

export function DataTable<Row extends DataTableRow>({
  aiId,
  caption,
  className,
  columns,
  emptyState = "No data available.",
  entity,
  rows,
  style
}: DataTableProps<Row>): JSX.Element {
  const tableAttributes = createAIAttributes({
    entity,
    id: aiId ?? `${entity}-table`,
    role: AIRole.TABLE,
    state: rows.length === 0 ? AIState.EMPTY : AIState.IDLE
  });

  return (
    <Box className={className} style={style}>
      <table {...tableAttributes} style={tableStyle}>
        {caption ? <caption>{caption}</caption> : null}
        <thead>
          <tr>
            {columns.map((column) => (
              <th
                key={column.key}
                {...createAIAttributes({
                  id: `${entity}-column-${column.key}`,
                  role: AIRole.FIELD,
                  fieldType: column.key
                })}
                scope="col"
                style={cellStyle}
              >
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 ? (
            <tr>
              <td colSpan={columns.length} style={cellStyle}>
                <Text as="p" tone="muted">
                  {emptyState}
                </Text>
              </td>
            </tr>
          ) : (
            rows.map((row) => (
              <tr
                key={row.id}
                {...createAIAttributes({
                  entity,
                  entityId: row.id,
                  id: `${entity}-row-${row.id}`,
                  role: AIRole.SECTION
                })}
              >
                {columns.map((column) => (
                  <td
                    key={column.key}
                    {...createAIAttributes({
                      entity,
                      entityId: row.id,
                      id: `${entity}-${row.id}-${column.key}`,
                      role: AIRole.FIELD
                    })}
                    data-ai-column-key={column.key}
                    data-ai-row-id={row.id}
                    style={cellStyle}
                  >
                    {column.render ? column.render(row) : row[column.key]}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </Box>
  );
}

export { DATA_AI_ENTITY_ID, DATA_AI_FIELD_TYPE };
