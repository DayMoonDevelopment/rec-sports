import { QueryHookOptions, useQuery } from "@apollo/client";
import { useLocalSearchParams } from "expo-router";
import {
    GetTeamDocument,
    GetTeamQuery,
    GetTeamQueryVariables,
} from "./queries/get-team.generated";

type UseTeamOptions = Omit<
  QueryHookOptions<GetTeamQuery, GetTeamQueryVariables>,
  "variables"
>;

export function useTeam(options: UseTeamOptions = {}) {
  const { teamId } = useLocalSearchParams<{ teamId: string }>();

  return useQuery(GetTeamDocument, {
    ...options,
    variables: {
      id: teamId!,
    },
    skip: !teamId,
    errorPolicy: "all",
  });
}
