import { Svg, Path } from "~/ui/svg";

import type { SvgProps } from "react-native-svg";

export const CalendarIcon = (props: SvgProps) => {
  return (
    <Svg viewBox="0 0 24 24" fill="none" {...props}>
      <Path
        {...props}
        d="M19 11.5H5v7a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1zm0-4a1 1 0 0 0-1-1H6a1 1 0 0 0-1 1v2h14zm2 11a3 3 0 0 1-3 3H6a3 3 0 0 1-3-3v-11a3 3 0 0 1 3-3h1v-1a1 1 0 0 1 2 0v1h6v-1a1 1 0 1 1 2 0v1h1a3 3 0 0 1 3 3z"
      />
    </Svg>
  );
};
