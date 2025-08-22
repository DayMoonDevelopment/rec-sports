import { Svg, Path } from "~/ui/svg";

import type { SvgProps } from "react-native-svg";

export const CircleIcon = (props: SvgProps) => (
  <Svg viewBox="0 0 24 24" fill="none" {...props}>
    <Path
      {...props}
      fillRule="evenodd"
      d="M12 4a8 8 0 1 0 0 16 8 8 0 0 0 0-16M2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10S2 17.523 2 12"
      clipRule="evenodd"
    />
  </Svg>
);
