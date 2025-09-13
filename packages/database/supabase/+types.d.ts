export type Json = string | number | boolean | null | {
    [key: string]: Json | undefined;
} | Json[];
export type Database = {
    graphql_public: {
        Tables: {
            [_ in never]: never;
        };
        Views: {
            [_ in never]: never;
        };
        Functions: {
            graphql: {
                Args: {
                    extensions?: Json;
                    operationName?: string;
                    query?: string;
                    variables?: Json;
                };
                Returns: Json;
            };
        };
        Enums: {
            [_ in never]: never;
        };
        CompositeTypes: {
            [_ in never]: never;
        };
    };
    public: {
        Tables: {
            game_actions: {
                Row: {
                    created_at: string | null;
                    created_by: string | null;
                    details: Json | null;
                    game_id: string;
                    id: string;
                    occurred_at: string | null;
                    occurred_by_user_id: string | null;
                    occurred_to_team_id: string | null;
                    point_value: number | null;
                    type: string;
                    updated_at: string | null;
                    updated_by: string | null;
                };
                Insert: {
                    created_at?: string | null;
                    created_by?: string | null;
                    details?: Json | null;
                    game_id: string;
                    id?: string;
                    occurred_at?: string | null;
                    occurred_by_user_id?: string | null;
                    occurred_to_team_id?: string | null;
                    point_value?: number | null;
                    type: string;
                    updated_at?: string | null;
                    updated_by?: string | null;
                };
                Update: {
                    created_at?: string | null;
                    created_by?: string | null;
                    details?: Json | null;
                    game_id?: string;
                    id?: string;
                    occurred_at?: string | null;
                    occurred_by_user_id?: string | null;
                    occurred_to_team_id?: string | null;
                    point_value?: number | null;
                    type?: string;
                    updated_at?: string | null;
                    updated_by?: string | null;
                };
                Relationships: [
                    {
                        foreignKeyName: "game_actions_created_by_fkey";
                        columns: ["created_by"];
                        isOneToOne: false;
                        referencedRelation: "users";
                        referencedColumns: ["id"];
                    },
                    {
                        foreignKeyName: "game_actions_game_id_fkey";
                        columns: ["game_id"];
                        isOneToOne: false;
                        referencedRelation: "games";
                        referencedColumns: ["id"];
                    },
                    {
                        foreignKeyName: "game_actions_occurred_by_user_id_fkey";
                        columns: ["occurred_by_user_id"];
                        isOneToOne: false;
                        referencedRelation: "users";
                        referencedColumns: ["id"];
                    },
                    {
                        foreignKeyName: "game_actions_occurred_to_team_id_fkey";
                        columns: ["occurred_to_team_id"];
                        isOneToOne: false;
                        referencedRelation: "teams";
                        referencedColumns: ["id"];
                    },
                    {
                        foreignKeyName: "game_actions_updated_by_fkey";
                        columns: ["updated_by"];
                        isOneToOne: false;
                        referencedRelation: "users";
                        referencedColumns: ["id"];
                    }
                ];
            };
            game_teams: {
                Row: {
                    created_at: string | null;
                    game_id: string;
                    id: string;
                    score: number | null;
                    team_id: string;
                    updated_at: string | null;
                };
                Insert: {
                    created_at?: string | null;
                    game_id: string;
                    id?: string;
                    score?: number | null;
                    team_id: string;
                    updated_at?: string | null;
                };
                Update: {
                    created_at?: string | null;
                    game_id?: string;
                    id?: string;
                    score?: number | null;
                    team_id?: string;
                    updated_at?: string | null;
                };
                Relationships: [
                    {
                        foreignKeyName: "game_teams_game_id_fkey";
                        columns: ["game_id"];
                        isOneToOne: false;
                        referencedRelation: "games";
                        referencedColumns: ["id"];
                    },
                    {
                        foreignKeyName: "game_teams_team_id_fkey";
                        columns: ["team_id"];
                        isOneToOne: false;
                        referencedRelation: "teams";
                        referencedColumns: ["id"];
                    }
                ];
            };
            games: {
                Row: {
                    created_at: string | null;
                    created_up: string | null;
                    game_state: string;
                    id: string;
                    location_id: string | null;
                    scheduled_at: string | null;
                    sport: string;
                    updated_at: string | null;
                    updated_by: string | null;
                };
                Insert: {
                    created_at?: string | null;
                    created_up?: string | null;
                    game_state?: string;
                    id?: string;
                    location_id?: string | null;
                    scheduled_at?: string | null;
                    sport: string;
                    updated_at?: string | null;
                    updated_by?: string | null;
                };
                Update: {
                    created_at?: string | null;
                    created_up?: string | null;
                    game_state?: string;
                    id?: string;
                    location_id?: string | null;
                    scheduled_at?: string | null;
                    sport?: string;
                    updated_at?: string | null;
                    updated_by?: string | null;
                };
                Relationships: [
                    {
                        foreignKeyName: "games_created_up_fkey";
                        columns: ["created_up"];
                        isOneToOne: false;
                        referencedRelation: "users";
                        referencedColumns: ["id"];
                    },
                    {
                        foreignKeyName: "games_location_id_fkey";
                        columns: ["location_id"];
                        isOneToOne: false;
                        referencedRelation: "locations";
                        referencedColumns: ["id"];
                    },
                    {
                        foreignKeyName: "games_updated_by_fkey";
                        columns: ["updated_by"];
                        isOneToOne: false;
                        referencedRelation: "users";
                        referencedColumns: ["id"];
                    }
                ];
            };
            location_facilities: {
                Row: {
                    bounds: Json | null;
                    details: Json | null;
                    geo: unknown;
                    id: string;
                    lat: number;
                    location_id: string;
                    lon: number;
                    sport: string;
                };
                Insert: {
                    bounds?: Json | null;
                    details?: Json | null;
                    geo: unknown;
                    id?: string;
                    lat: number;
                    location_id: string;
                    lon: number;
                    sport: string;
                };
                Update: {
                    bounds?: Json | null;
                    details?: Json | null;
                    geo?: unknown;
                    id?: string;
                    lat?: number;
                    location_id?: string;
                    lon?: number;
                    sport?: string;
                };
                Relationships: [
                    {
                        foreignKeyName: "location_facilities_location_id_fkey";
                        columns: ["location_id"];
                        isOneToOne: false;
                        referencedRelation: "locations";
                        referencedColumns: ["id"];
                    }
                ];
            };
            location_tags: {
                Row: {
                    created_at: string | null;
                    id: string;
                    location_id: string;
                    name: string;
                    updated_at: string | null;
                    value: string;
                };
                Insert: {
                    created_at?: string | null;
                    id?: string;
                    location_id: string;
                    name: string;
                    updated_at?: string | null;
                    value: string;
                };
                Update: {
                    created_at?: string | null;
                    id?: string;
                    location_id?: string;
                    name?: string;
                    updated_at?: string | null;
                    value?: string;
                };
                Relationships: [
                    {
                        foreignKeyName: "location_tags_location_id_fkey";
                        columns: ["location_id"];
                        isOneToOne: false;
                        referencedRelation: "locations";
                        referencedColumns: ["id"];
                    }
                ];
            };
            locations: {
                Row: {
                    bounds: Json | null;
                    city: string | null;
                    country: string | null;
                    county: string | null;
                    created_at: string | null;
                    details: Json | null;
                    geo: unknown;
                    id: string;
                    lat: number;
                    lon: number;
                    name: string | null;
                    postal_code: string | null;
                    search_vector: unknown | null;
                    search_vector_meta: Json | null;
                    sport_tags: string[] | null;
                    state: string | null;
                    street: string | null;
                    updated_at: string | null;
                };
                Insert: {
                    bounds?: Json | null;
                    city?: string | null;
                    country?: string | null;
                    county?: string | null;
                    created_at?: string | null;
                    details?: Json | null;
                    geo: unknown;
                    id?: string;
                    lat: number;
                    lon: number;
                    name?: string | null;
                    postal_code?: string | null;
                    search_vector?: unknown | null;
                    search_vector_meta?: Json | null;
                    sport_tags?: string[] | null;
                    state?: string | null;
                    street?: string | null;
                    updated_at?: string | null;
                };
                Update: {
                    bounds?: Json | null;
                    city?: string | null;
                    country?: string | null;
                    county?: string | null;
                    created_at?: string | null;
                    details?: Json | null;
                    geo?: unknown;
                    id?: string;
                    lat?: number;
                    lon?: number;
                    name?: string | null;
                    postal_code?: string | null;
                    search_vector?: unknown | null;
                    search_vector_meta?: Json | null;
                    sport_tags?: string[] | null;
                    state?: string | null;
                    street?: string | null;
                    updated_at?: string | null;
                };
                Relationships: [];
            };
            team_members: {
                Row: {
                    created_at: string | null;
                    created_up: string | null;
                    id: string;
                    team_id: string;
                    updated_at: string | null;
                    updated_by: string | null;
                    user_id: string;
                };
                Insert: {
                    created_at?: string | null;
                    created_up?: string | null;
                    id?: string;
                    team_id: string;
                    updated_at?: string | null;
                    updated_by?: string | null;
                    user_id: string;
                };
                Update: {
                    created_at?: string | null;
                    created_up?: string | null;
                    id?: string;
                    team_id?: string;
                    updated_at?: string | null;
                    updated_by?: string | null;
                    user_id?: string;
                };
                Relationships: [
                    {
                        foreignKeyName: "team_members_created_up_fkey";
                        columns: ["created_up"];
                        isOneToOne: false;
                        referencedRelation: "users";
                        referencedColumns: ["id"];
                    },
                    {
                        foreignKeyName: "team_members_team_id_fkey";
                        columns: ["team_id"];
                        isOneToOne: false;
                        referencedRelation: "teams";
                        referencedColumns: ["id"];
                    },
                    {
                        foreignKeyName: "team_members_updated_by_fkey";
                        columns: ["updated_by"];
                        isOneToOne: false;
                        referencedRelation: "users";
                        referencedColumns: ["id"];
                    },
                    {
                        foreignKeyName: "team_members_user_id_fkey";
                        columns: ["user_id"];
                        isOneToOne: false;
                        referencedRelation: "users";
                        referencedColumns: ["id"];
                    }
                ];
            };
            teams: {
                Row: {
                    created_at: string | null;
                    created_up: string | null;
                    id: string;
                    invite_code: string | null;
                    name: string | null;
                    sport_tags: string[] | null;
                    team_type: string;
                    updated_at: string | null;
                    updated_by: string | null;
                };
                Insert: {
                    created_at?: string | null;
                    created_up?: string | null;
                    id?: string;
                    invite_code?: string | null;
                    name?: string | null;
                    sport_tags?: string[] | null;
                    team_type: string;
                    updated_at?: string | null;
                    updated_by?: string | null;
                };
                Update: {
                    created_at?: string | null;
                    created_up?: string | null;
                    id?: string;
                    invite_code?: string | null;
                    name?: string | null;
                    sport_tags?: string[] | null;
                    team_type?: string;
                    updated_at?: string | null;
                    updated_by?: string | null;
                };
                Relationships: [
                    {
                        foreignKeyName: "teams_created_up_fkey";
                        columns: ["created_up"];
                        isOneToOne: false;
                        referencedRelation: "users";
                        referencedColumns: ["id"];
                    },
                    {
                        foreignKeyName: "teams_updated_by_fkey";
                        columns: ["updated_by"];
                        isOneToOne: false;
                        referencedRelation: "users";
                        referencedColumns: ["id"];
                    }
                ];
            };
            users: {
                Row: {
                    auth_id: string | null;
                    created_at: string | null;
                    display_name: string | null;
                    email: string;
                    first_name: string | null;
                    id: string;
                    invite_code: string | null;
                    last_name: string | null;
                    photo: string | null;
                    updated_at: string | null;
                };
                Insert: {
                    auth_id?: string | null;
                    created_at?: string | null;
                    display_name?: string | null;
                    email: string;
                    first_name?: string | null;
                    id?: string;
                    invite_code?: string | null;
                    last_name?: string | null;
                    photo?: string | null;
                    updated_at?: string | null;
                };
                Update: {
                    auth_id?: string | null;
                    created_at?: string | null;
                    display_name?: string | null;
                    email?: string;
                    first_name?: string | null;
                    id?: string;
                    invite_code?: string | null;
                    last_name?: string | null;
                    photo?: string | null;
                    updated_at?: string | null;
                };
                Relationships: [];
            };
        };
        Views: {
            [_ in never]: never;
        };
        Functions: {
            gtrgm_compress: {
                Args: {
                    "": unknown;
                };
                Returns: unknown;
            };
            gtrgm_decompress: {
                Args: {
                    "": unknown;
                };
                Returns: unknown;
            };
            gtrgm_in: {
                Args: {
                    "": unknown;
                };
                Returns: unknown;
            };
            gtrgm_options: {
                Args: {
                    "": unknown;
                };
                Returns: undefined;
            };
            gtrgm_out: {
                Args: {
                    "": unknown;
                };
                Returns: unknown;
            };
            nanoid: {
                Args: {
                    alphabet?: string;
                    prefix: string;
                    size?: number;
                };
                Returns: string;
            };
            set_limit: {
                Args: {
                    "": number;
                };
                Returns: number;
            };
            show_limit: {
                Args: Record<PropertyKey, never>;
                Returns: number;
            };
            show_trgm: {
                Args: {
                    "": string;
                };
                Returns: string[];
            };
            uid: {
                Args: Record<PropertyKey, never>;
                Returns: string;
            };
            user_is_in_game: {
                Args: {
                    game_id_param: string;
                };
                Returns: boolean;
            };
            user_is_in_team: {
                Args: {
                    team_id_param: string;
                };
                Returns: boolean;
            };
        };
        Enums: {
            [_ in never]: never;
        };
        CompositeTypes: {
            [_ in never]: never;
        };
    };
};
type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">;
type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">];
export type Tables<DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] & DefaultSchema["Views"]) | {
    schema: keyof DatabaseWithoutInternals;
}, TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
} ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] & DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"]) : never = never> = DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
} ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] & DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
    Row: infer R;
} ? R : never : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] & DefaultSchema["Views"]) ? (DefaultSchema["Tables"] & DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
    Row: infer R;
} ? R : never : never;
export type TablesInsert<DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"] | {
    schema: keyof DatabaseWithoutInternals;
}, TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
} ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] : never = never> = DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
} ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
    Insert: infer I;
} ? I : never : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"] ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
    Insert: infer I;
} ? I : never : never;
export type TablesUpdate<DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"] | {
    schema: keyof DatabaseWithoutInternals;
}, TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
} ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] : never = never> = DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
} ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
    Update: infer U;
} ? U : never : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"] ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
    Update: infer U;
} ? U : never : never;
export type Enums<DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"] | {
    schema: keyof DatabaseWithoutInternals;
}, EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
} ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"] : never = never> = DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
} ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName] : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"] ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions] : never;
export type CompositeTypes<PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"] | {
    schema: keyof DatabaseWithoutInternals;
}, CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
} ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"] : never = never> = PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
} ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName] : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"] ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions] : never;
export declare const Constants: {
    readonly graphql_public: {
        readonly Enums: {};
    };
    readonly public: {
        readonly Enums: {};
    };
};
export {};
//# sourceMappingURL=+types.d.ts.map