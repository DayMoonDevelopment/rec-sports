import Svg, { Path } from "react-native-svg";

import { cn } from "~/lib/utils";
import type { SvgProps } from "~/ui/svg";

export const SearchIcon = (props: SvgProps) => (
  <Svg
    viewBox="0 0 24 24"
    fill="none"
    {...props}
    className={cn("size-6 text-black dark:text-white", props?.className)}
  >
    <Path
      {...props}
      fillRule="evenodd"
      d="M11 5a6 6 0 1 0 0 12 6 6 0 0 0 0-12m-8 6a8 8 0 1 1 14.32 4.906l3.387 3.387a1 1 0 0 1-1.414 1.414l-3.387-3.387A8 8 0 0 1 3 11"
      clipRule="evenodd"
    />
  </Svg>
);
