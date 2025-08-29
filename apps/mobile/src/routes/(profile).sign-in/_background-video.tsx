import { StyleSheet } from "react-native";
import { VideoView, useVideoPlayer } from "expo-video";

import type { VideoPlayer } from "expo-video";

const videoAssetId = require("./assets/sport-montage.mp4");

function setupVideoPlayer(player: VideoPlayer) {
  player.loop = true;
  player.muted = true;
  player.play();
}

export function BackgroundVideo() {
  const player = useVideoPlayer(videoAssetId, setupVideoPlayer);

  return (
    <VideoView
      style={StyleSheet.absoluteFillObject}
      player={player}
      audioMixingMode="doNotMix"
      playsInline
      showsTimecodes={false}
      allowsFullscreen={false}
      allowsPictureInPicture={false}
      nativeControls={false}
      allowsVideoFrameAnalysis={false}
      contentFit="cover"
    />
  );
}
