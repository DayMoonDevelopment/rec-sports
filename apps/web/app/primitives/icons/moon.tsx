import type { SVGProps } from "react";

export function MoonIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      {...props}
    >
      <path
        fill="currentColor"
        d="M12.052 3.6a1 1 0 0 0-.908-1.564C6.02 2.47 2 6.764 2 11.998c0 5.522 4.476 9.998 9.998 9.998 5.234 0 9.528-4.021 9.962-9.144a1 1 0 0 0-1.564-.908A6 6 0 0 1 12.051 3.6"
      />
    </svg>
  );
}
