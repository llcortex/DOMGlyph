import type { AIAction, AIEvent, AIState } from "@domglyph/ai-contract";
import type {
  ButtonBaseProps,
  DialogBaseProps,
  InputBaseProps,
  PrimitiveBoxProps
} from "@domglyph/primitives";
import type { ReactNode } from "react";

export interface ActionButtonProps extends Omit<ButtonBaseProps, "children"> {
  readonly action: AIAction;
  readonly aiId?: string;
  readonly aiState?: AIState | readonly AIState[];
  readonly children: ReactNode;
}

export interface FormFieldProps
  extends Omit<InputBaseProps, "aria-describedby" | "id" | "required" | "type"> {
  readonly fieldId: string;
  readonly label: ReactNode;
  readonly fieldType: string;
  readonly required?: boolean;
  readonly hint?: ReactNode;
  readonly error?: ReactNode;
  readonly successMessage?: ReactNode;
}

export interface StatusBannerProps extends PrimitiveBoxProps {
  readonly aiId: string;
  readonly event?: AIEvent;
  readonly status: "success" | "error" | "info";
  readonly title?: ReactNode;
  readonly children: ReactNode;
}

export interface ConfirmDialogProps
  extends Omit<DialogBaseProps, "ariaLabel" | "ariaLabelledBy" | "children" | "title"> {
  readonly aiId: string;
  readonly title: ReactNode;
  readonly description?: ReactNode;
  readonly confirmAction: AIAction;
  readonly cancelAction: AIAction;
  readonly confirmLabel?: ReactNode;
  readonly cancelLabel?: ReactNode;
  readonly onConfirm?: () => void;
  readonly onCancel?: () => void;
}

export interface DataTableColumn<Row extends DataTableRow> {
  readonly key: keyof Row & string;
  readonly header: ReactNode;
  readonly render?: (row: Row) => ReactNode;
}

export interface DataTableRow {
  readonly id: string;
  readonly [key: string]: ReactNode;
}

export interface DataTableProps<Row extends DataTableRow> extends PrimitiveBoxProps {
  readonly aiId?: string;
  readonly entity: string;
  readonly columns: readonly DataTableColumn<Row>[];
  readonly rows: readonly Row[];
  readonly caption?: ReactNode;
  readonly emptyState?: ReactNode;
}

export interface ComponentContract {
  readonly name: string;
  readonly primitive: string;
}
