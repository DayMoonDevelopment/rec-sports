import { PostHogProvider as CorePostHogProvider } from "posthog-react-native";

import "~/lib/background-update";
import "~/lib/nativewind";

export function PostHogProvider({ children }: { children: React.ReactNode }) {
  return (
    <CorePostHogProvider
      apiKey={process.env.EXPO_PUBLIC_POSTHOG_PROJECT_ID}
      options={{
        host: "https://us.i.posthog.com",
        enableSessionReplay: true,
      }}
      autocapture
    >
      {children}
    </CorePostHogProvider>
  );
}
