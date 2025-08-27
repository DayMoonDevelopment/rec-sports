import { Text, View, StyleSheet, Image } from "react-native";
import { VideoView, useVideoPlayer } from "expo-video";

import type { VideoPlayer } from "expo-video";

const logoAssetId = require("./assets/rec-icon.png");
const videoAssetId = require("./assets/sport-montage.mp4");

function setupVideoPlayer(player: VideoPlayer) {
  player.loop = true;
  player.muted = true;
  player.play();
}

export function Login() {
  const player = useVideoPlayer(videoAssetId, setupVideoPlayer);

  return (
    <View className="h-full w-full">
      <VideoView
        style={{ ...StyleSheet.absoluteFillObject }}
        player={player}
        playsInline
        showsTimecodes={false}
        allowsFullscreen={false}
        allowsPictureInPicture={false}
        nativeControls={false}
        allowsVideoFrameAnalysis={false}
        contentFit="cover"
      />

      <View className="bg-black/50 h-full w-full flex flex-col py-safe p-4">
        <View className="flex-1 flex flex-col gap-3 items-center justify-start">
          <Image source={logoAssetId} style={{ objectFit: "contain" }} />
          <Text className="text-5xl font-semibold text-white">
            Join the game.
          </Text>
        </View>

        <View className="flex flex-col gap-2 ">
          <Text>Continue with Apple</Text>
          <Text>Continue with Google</Text>
        </View>
      </View>
    </View>
  );
}
