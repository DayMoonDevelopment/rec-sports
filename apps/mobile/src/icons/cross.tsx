import Svg, { Path } from "react-native-svg";

import { cn } from "~/lib/utils";
import type { SvgProps } from "~/ui/svg";

export const CrossIcon = (props: SvgProps) => (
  <Svg
    viewBox="0 0 24 24"
    fill="none"
    {...props}
    className={cn("size-6 text-black dark:text-white", props?.className)}
  >
    <Path
      {...props}
      fillRule="evenodd"
      d="M4.293 4.293a1 1 0 0 1 1.414 0L12 10.586l6.293-6.293a1 1 0 1 1 1.414 1.414L13.414 12l6.293 6.293a1 1 0 0 1-1.414 1.414L12 13.414l-6.293 6.293a1 1 0 0 1-1.414-1.414L10.586 12 4.293 5.707a1 1 0 0 1 0-1.414"
      clipRule="evenodd"
    />
  </Svg>
);
