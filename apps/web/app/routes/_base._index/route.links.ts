// app/routes/some-route.tsx
import styles from "./route.css?url";

export function links() {
  return [{ rel: "stylesheet", href: styles }];
}
