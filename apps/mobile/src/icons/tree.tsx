import { Svg, Path } from "~/ui/svg";

import type { SvgProps } from "react-native-svg";

export const TreeIcon = (props: SvgProps) => (
  <Svg viewBox="0 0 24 24" fill="none" {...props}>
    <Path
      {...props}
      d="M19 11a7 7 0 1 0-14 0 7 7 0 0 0 14 0m2 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0"
    />
    <Path
      {...props}
      d="M11 21v-5.586l-1.707-1.707a1 1 0 1 1 1.414-1.414L12 13.586l2.293-2.293a1 1 0 1 1 1.414 1.414L13 15.414V21a1 1 0 1 1-2 0"
    />
  </Svg>
);
