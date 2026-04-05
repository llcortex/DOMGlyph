export { Box } from "./Box";
export { ButtonBase } from "./ButtonBase";
export { DialogBase } from "./DialogBase";
export { InputBase } from "./InputBase";
export { Portal } from "./Portal";
export { Stack } from "./Stack";
export { Text } from "./Text";
export { primitiveTheme, primitiveVars } from "./styles";
export type {
  ButtonBaseProps,
  DialogBaseProps,
  InputBaseProps,
  PolymorphicProps,
  PortalProps,
  PrimitiveAriaProps,
  PrimitiveBoxProps,
  PrimitiveElement,
  PrimitiveStyleProps,
  StackOwnProps,
  SurfaceDescriptor,
  TextOwnProps
} from "./types";

import { colorTokens } from "@domglyph/tokens";
import type { SurfaceDescriptor } from "./types";

/**
 * Backwards-compatible descriptor retained while higher-level packages migrate
 * to the React primitive exports introduced in this package.
 */
export const primitiveSurface: SurfaceDescriptor = {
  id: "surface",
  tokenNamespace: colorTokens.name
};
