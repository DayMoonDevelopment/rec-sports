import { cssInterop } from "nativewind";
import Svg, { Path } from "react-native-svg";

import "../../global.css";

cssInterop(Svg, {
  className: {
    target: "style",
    nativeStyleToProp: { width: true, height: true, fill: true },
  },
});

cssInterop(Path, {
  className: {
    target: false,
    nativeStyleToProp: { color: "fill" },
  },
});
