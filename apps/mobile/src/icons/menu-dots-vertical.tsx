import { Svg, Path } from "~/ui/svg";

import type { SvgProps } from "react-native-svg";

export const MenuDotsVerticalIcon = (props: SvgProps) => {
  return (
    <Svg viewBox="0 0 24 24" fill="none" {...props}>
      <Path
        {...props}
        d="M10 4a2 2 0 1 1 4 0 2 2 0 0 1-4 0M10 12a2 2 0 1 1 4 0 2 2 0 0 1-4 0M10 20a2 2 0 1 1 4 0 2 2 0 0 1-4 0"
      />
    </Svg>
  );
};
