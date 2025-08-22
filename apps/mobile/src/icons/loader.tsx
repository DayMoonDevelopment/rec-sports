import Svg, { Path } from "react-native-svg";

import { cn } from "~/lib/utils";
import type { SvgProps } from "~/ui/svg";

export const LoaderIcon = (props: SvgProps) => (
  <Svg
    viewBox="0 0 24 24"
    fill="none"
    {...props}
    className={cn("size-6 text-black dark:text-white", props?.className)}
  >
    <Path
      {...props}
      fillOpacity={0.3}
      d="M20 12a8 8 0 1 0-16 0 8 8 0 0 0 16 0m2 0c0 5.523-4.477 10-10 10S2 17.523 2 12 6.477 2 12 2s10 4.477 10 10"
    />
    <Path
      {...props}
      d="M21.055 12.006c.549.06.945.555.884 1.104a10.005 10.005 0 0 1-8.829 8.83 1.001 1.001 0 0 1-.22-1.989 8.005 8.005 0 0 0 7.061-7.061 1 1 0 0 1 1.104-.884"
    />
  </Svg>
);
