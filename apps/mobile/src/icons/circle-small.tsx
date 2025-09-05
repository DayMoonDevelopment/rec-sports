import { Svg, Path } from "~/ui/svg";

import type { SvgProps } from "react-native-svg";

export const CircleSmallIcon = (props: SvgProps & { filled?: boolean }) => {
  if (props?.filled) {
    return (
      <Svg viewBox="0 0 24 24" fill="none" {...props}>
        <Path {...props} d="M12 6a6 6 0 1 0 0 12 6 6 0 0 0 0-12" />
      </Svg>
    );
  }

  if (__DEV__) {
    console.warn("[CircleSmallIcon] add the non-filled version");
  }

  return null;
};
