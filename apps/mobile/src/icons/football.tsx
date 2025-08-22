import { Svg, Path } from "~/ui/svg";

import type { SvgProps } from "react-native-svg";

export const FootballIcon = (props: SvgProps & { filled?: boolean }) => {
  if (props?.filled) {
    return (
      <Svg viewBox="0 0 24 24" fill="none" {...props}>
        <Path
          {...props}
          fillRule="evenodd"
          d="M11.288 4A11.06 11.06 0 0 0 4 11.288L12.712 20A11.06 11.06 0 0 0 20 12.712zm2.798 7.115a.849.849 0 0 0-1.2-1.2l-2.972 2.97a.849.849 0 1 0 1.2 1.2z"
          clipRule="evenodd"
        />
        <Path
          {...props}
          d="M3 14.412q0-.717.08-1.412L11 20.92q-.695.08-1.412.08H4.882A1.88 1.88 0 0 1 3 19.118zM20.92 11q.08-.695.08-1.412V4.882C21 3.842 20.157 3 19.118 3h-4.706q-.717 0-1.412.08z"
        />
      </Svg>
    );
  }

  return (
    <Svg viewBox="0 0 24 24" fill="none" {...props}>
      <Path
        {...props}
        d="M14.211 11.061A.9.9 0 1 0 12.94 9.79l-3.15 3.15a.9.9 0 0 0 1.272 1.272z"
      />
      <Path
        {...props}
        fillRule="evenodd"
        d="M14.7 3q-.924.001-1.81.14A11.71 11.71 0 0 0 3 14.7v4.5A1.8 1.8 0 0 0 4.8 21h4.5q.924 0 1.81-.14A11.71 11.71 0 0 0 21 9.3V4.8A1.8 1.8 0 0 0 19.2 3zm4.5 5.927L15.073 4.8H19.2zm-6.476-3.93 6.279 6.279a9.91 9.91 0 0 1-7.727 7.727l-6.279-6.279a9.91 9.91 0 0 1 7.727-7.727M4.8 15.073 8.927 19.2H4.8z"
        clipRule="evenodd"
      />
    </Svg>
  );
};
