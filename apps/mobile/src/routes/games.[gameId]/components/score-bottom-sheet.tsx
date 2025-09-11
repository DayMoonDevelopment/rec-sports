import React from "react";
import { View } from "react-native";
import { BottomSheetModal, BottomSheetView } from "@gorhom/bottom-sheet";

import { Button, ButtonText } from "~/ui/button";

import { useScoreSheet } from "../score-context";

import { TeamItem } from "./score-bottom-sheet-team-item";
import { ScoreTypeItem } from "./score-type-item";
import { ScoreBottomSheetBackdrop } from "./score-bottom-sheet-backdrop";
import { PlayerSelection } from "./player-selection";

export function ScoreBottomSheet() {
  const {
    bottomSheetRef,
    teams,
    scoreTypes,
    sportConfig,
    showScoreTypes,
    isUpdating,
    isProcessing,
    handleSubmit,
  } = useScoreSheet();

  return (
    <BottomSheetModal
      ref={bottomSheetRef}
      backdropComponent={ScoreBottomSheetBackdrop}
      style={{
        shadowColor: "#000",
        shadowOffset: {
          width: 0,
          height: 7,
        },
        shadowOpacity: 0.41,
        shadowRadius: 9.11,
        elevation: 14,
      }}
    >
      <BottomSheetView className="flex-1 pb-safe flex flex-col items-center gap-6">
        {/* Team Selection */}
        <View className="px-4 flex-row flex-wrap gap-2">
          {teams.map((team) => (
            <View key={team.id} className="flex-1 min-w-[45%]">
              <TeamItem {...team} />
            </View>
          ))}
        </View>

        {/* Player Selection */}
        <PlayerSelection />

        {/* Score Type Selection - only show if sport has multiple score types */}
        {showScoreTypes
          ? [
              <View key="divider" className="w-[75%] h-px bg-border" />,
              <View
                key="score-types"
                className="px-4 w-full flex-1 flex-col gap-2"
              >
                {scoreTypes.map((scoreType) => (
                  <ScoreTypeItem key={scoreType.actionKey} {...scoreType} />
                ))}
              </View>,
            ]
          : null}

        <View className="w-[75%] h-px bg-border" />

        <View className="px-4 w-full">
          <Button
            onPress={handleSubmit}
            className="w-full"
            disabled={isProcessing}
          >
            <ButtonText>
              {isProcessing
                ? isUpdating
                  ? "Updating Score..."
                  : "Adding Score..."
                : isUpdating
                  ? "Update Score"
                  : sportConfig?.addScoreButtonLabel || "Add Score"}
            </ButtonText>
          </Button>
        </View>
      </BottomSheetView>
    </BottomSheetModal>
  );
}
