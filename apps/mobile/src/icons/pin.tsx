import { Svg, Path } from "~/ui/svg";

import type { SvgProps } from "react-native-svg";

export const PinIcon = (props: SvgProps) => (
  <Svg viewBox="0 0 24 24" fill="none" {...props}>
    <Path
      {...props}
      d="M9.172 5.171A4 4 0 1 1 13 11.873V19a1 1 0 1 1-2 0v-7.126a4 4 0 0 1-1.828-6.703"
    />
  </Svg>
);
