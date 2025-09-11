import React, {
  useCallback,
  useRef,
  forwardRef,
  useImperativeHandle,
} from "react";
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import { useQuery } from "@apollo/client";

import { BottomSheetHeader } from "./bottom-sheet-header";
import { BottomSheetContent } from "./bottom-sheet-content";

import { SuggestedTeamsDocument } from "../queries/suggested-teams.generated";
import type { SuggestedTeamsQuery } from "../queries/suggested-teams.generated";

type Team = NonNullable<
  SuggestedTeamsQuery["suggestedTeams"]["edges"][0]["node"]
>;

interface TeamSelectionBottomSheetProps {
  selectedTeamIds: string[];
  onTeamSelect: (team: Team) => void;
  onTeamDeselect: (teamId: string) => void;
}

export interface TeamSelectionBottomSheetRef {
  present: () => void;
  dismiss: () => void;
}

export const TeamSelectionBottomSheet = forwardRef<
  TeamSelectionBottomSheetRef,
  TeamSelectionBottomSheetProps
>(({ selectedTeamIds, onTeamSelect, onTeamDeselect }, ref) => {
  const bottomSheetRef = useRef<BottomSheet>(null);
  const snapPoints = ["75%"];

  const { data, loading, error, fetchMore } = useQuery(SuggestedTeamsDocument, {
    variables: { first: 20 },
    notifyOnNetworkStatusChange: true,
  });

  useImperativeHandle(ref, () => ({
    present: () => bottomSheetRef.current?.expand(),
    dismiss: () => bottomSheetRef.current?.close(),
  }));

  const renderBackdrop = useCallback(
    (props: any) => <BottomSheetBackdrop {...props} disappearsOnIndex={-1} />,
    [],
  );

  const handleTeamPress = (team: Team) => {
    const isSelected = selectedTeamIds.includes(team.id);
    if (isSelected) {
      onTeamDeselect(team.id);
    } else {
      onTeamSelect(team);
    }
  };

  const handleLoadMore = () => {
    if (data?.suggestedTeams?.pageInfo?.hasNextPage && !loading) {
      fetchMore({
        variables: {
          after: data.suggestedTeams.pageInfo.endCursor,
        },
      });
    }
  };

  const teams = data?.suggestedTeams?.edges?.map((edge) => edge.node) || [];

  return (
    <BottomSheet
      ref={bottomSheetRef}
      index={-1}
      snapPoints={snapPoints}
      enablePanDownToClose
      backdropComponent={renderBackdrop}
    >
      <BottomSheetView className="flex-1">
        <BottomSheetHeader />

        <BottomSheetContent
          teams={teams}
          loading={loading}
          error={error}
          selectedTeamIds={selectedTeamIds}
          onTeamPress={handleTeamPress}
          onLoadMore={handleLoadMore}
        />
      </BottomSheetView>
    </BottomSheet>
  );
});

TeamSelectionBottomSheet.displayName = "TeamSelectionBottomSheet";
