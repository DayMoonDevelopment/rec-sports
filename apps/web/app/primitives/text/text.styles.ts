import { cva } from "class-variance-authority";

export const textStyles = cva("", {
  variants: {
    variant: {
      "headline-1": "text-6xl xl:text-8xl font-semibold",
      "headline-2": "text-5xl xl:text-7xl font-semibold",
      "headline-3": "text-4xl xl:text-6xl font-semibold",
      h1: "text-2xl xl:text-4xl font-semibold",
      h2: "text-3xl font-semibold",
      h3: "text-2xl font-semibold",
      h4: "text-xl font-semibold",
      h5: "text-lg font-bold",
      h6: "text-base font-bold",
      large: "text-lg",
      body: "text-base",
      small: "text-sm",
      tiny: "text-xs",
    },
    weight: {
      light: "font-light",
      normal: "font-normal",
      medium: "font-medium",
      semibold: "font-semibold",
      bold: "font-bold",
    },
    align: {
      left: "text-left",
      center: "text-center",
      right: "text-right",
    },
  },
  defaultVariants: {
    variant: "body",
  },
});
