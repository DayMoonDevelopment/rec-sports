import CoreSvg, { Path as CorePath } from "react-native-svg";

import { cn } from "~/lib/utils";

import type { SvgProps, PathProps } from "react-native-svg";

export function Svg(props: SvgProps) {
  return <CoreSvg {...props} className={cn("size-6", props.className)} />;
}

export function Path(props: PathProps) {
  return (
    <CorePath {...props} className={cn("text-foreground", props.className)} />
  );
}
