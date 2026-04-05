export { ActionButton } from "./ActionButton";
export { ConfirmDialog } from "./ConfirmDialog";
export { DataTable } from "./DataTable";
export { FormField } from "./FormField";
export { StatusBanner } from "./StatusBanner";
export type {
  ActionButtonProps,
  ComponentContract,
  ConfirmDialogProps,
  DataTableColumn,
  DataTableProps,
  DataTableRow,
  FormFieldProps,
  StatusBannerProps
} from "./types";

import { primitiveSurface } from "@domglyph/primitives";
import type { ComponentContract } from "./types";

export const cardComponent: ComponentContract = {
  name: "Card",
  primitive: primitiveSurface.id
};
