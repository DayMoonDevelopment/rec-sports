import { Svg, Path } from "~/ui/svg";

import type { SvgProps } from "react-native-svg";

export const PlusSmallIcon = (props: SvgProps) => (
  <Svg viewBox="0 0 24 24" fill="none" {...props}>
    <Path
      {...props}
      d="M11 17v-4H7a1 1 0 1 1 0-2h4V7a1 1 0 1 1 2 0v4h4a1 1 0 1 1 0 2h-4v4a1 1 0 1 1-2 0"
    />
  </Svg>
);
