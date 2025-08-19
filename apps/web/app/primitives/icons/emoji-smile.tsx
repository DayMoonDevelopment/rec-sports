import type { SVGProps } from "react";

export function EmojiSmileIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      {...props}
    >
      <path
        fill="currentColor"
        fillRule="evenodd"
        d="M22 12c0 5.523-4.477 10-10 10S2 17.523 2 12 6.477 2 12 2s10 4.477 10 10M8.465 14.121a1 1 0 0 1 1.414 0 3 3 0 0 0 4.243 0 1 1 0 0 1 1.414 1.415 5 5 0 0 1-7.071 0 1 1 0 0 1 0-1.415M9.25 8.25a1.25 1.25 0 1 0 0 2.5 1.25 1.25 0 0 0 0-2.5M13.5 9.5a1.25 1.25 0 1 1 2.5 0 1.25 1.25 0 0 1-2.5 0"
        clipRule="evenodd"
      />
    </svg>
  );
}
