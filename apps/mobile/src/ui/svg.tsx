import { forwardRef } from "react";
import Svg, { Path, type SvgProps as RNSvgProps, type PathProps as RNPathProps } from "react-native-svg";

import { cn } from "~/lib/utils";

// Extend SvgProps to include className
export interface SvgProps extends RNSvgProps {
  className?: string;
}

// Extend PathProps to include className
export interface PathProps extends RNPathProps {
  className?: string;
}

// Custom Svg component that handles className
export const CustomSvg = forwardRef<any, SvgProps>(({ className, ...props }, ref) => (
  <Svg ref={ref} {...props} className={cn(className)} />
));

// Custom Path component that handles className
export const CustomPath = forwardRef<any, PathProps>(({ className, ...props }, ref) => (
  <Path ref={ref} {...props} className={cn(className)} />
));

CustomSvg.displayName = "CustomSvg";
CustomPath.displayName = "CustomPath";