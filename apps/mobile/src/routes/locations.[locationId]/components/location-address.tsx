import { Text, Pressable, Linking, Platform } from "react-native";

interface LocationAddressProps {
  address: {
    street: string;
    street2: string | null;
    city: string;
    stateCode: string;
    postalCode: string;
  };
}

export function LocationAddress({ address }: LocationAddressProps) {
  async function handleGetDirections() {
    const { street, street2, city, stateCode, postalCode } = address;
    const addressParts = [street, street2, city, stateCode, postalCode].filter(
      Boolean,
    );
    const fullAddress = addressParts.join(", ");
    const encodedAddress = encodeURIComponent(fullAddress);

    // Try different URL schemes in order of preference
    const urlsToTry = [
      // Universal geo: URI that works across platforms and respects user's default map app
      `geo:0,0?q=${encodedAddress}`,
      // Platform-specific fallbacks
      Platform.OS === "ios"
        ? `maps://?q=${encodedAddress}`
        : `geo:${encodedAddress}`,
      // Google Maps as backup (works on both platforms)
      `comgooglemaps://?q=${encodedAddress}`,
      // Web fallback
      `https://maps.google.com/?q=${encodedAddress}`,
    ];

    // Try each URL scheme until one works
    for (const url of urlsToTry) {
      try {
        const canOpen = await Linking.canOpenURL(url);
        if (canOpen) {
          await Linking.openURL(url);
          return; // Success, exit early
        }
      } catch (error) {
        // Continue to next URL scheme
        continue;
      }
    }

    // If all else fails, open in browser
    const webUrl = `https://maps.google.com/?q=${encodedAddress}`;
    Linking.openURL(webUrl).catch(() => {
      console.warn("Failed to open maps application");
    });
  }

  return (
    <Pressable
      className="flex-1 mb-4 active:opacity-50 transition-opacity"
      onPress={handleGetDirections}
    >
      {[
        address.street,
        address.street2,
        `${address.city}, ${address.stateCode} ${address.postalCode}`,
      ]
        .filter(Boolean)
        .map((addressPart, index) => (
          <Text
            className="text-muted-foreground text-base"
            key={`address-part-${index}`}
          >
            {addressPart}
          </Text>
        ))}
    </Pressable>
  );
}
