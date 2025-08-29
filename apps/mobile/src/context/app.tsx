import React, {
  createContext,
  useContext,
  useReducer,
  useCallback,
  useEffect,
} from "react";
import * as SplashScreen from "expo-splash-screen";

import type { ReactNode } from "react";

// Keep splash screen visible while we prepare the app
SplashScreen.preventAutoHideAsync();

// Define provider types
type ProviderName = "apollo-cache";

// Define ready state for each provider
type ReadyState = {
  [K in ProviderName]: boolean;
};

// Define action types for the reducer
type ReadyAction =
  | { type: "SET_PROVIDER_READY"; provider: ProviderName }
  | { type: "SET_PROVIDER_NOT_READY"; provider: ProviderName }
  | { type: "RESET_ALL" };

// Initial state - all providers start as not ready
const initialState: ReadyState = {
  "apollo-cache": false,
};

// Reducer to manage ready states
const readyReducer = (state: ReadyState, action: ReadyAction): ReadyState => {
  switch (action.type) {
    case "SET_PROVIDER_READY":
      return { ...state, [action.provider]: true };
    case "SET_PROVIDER_NOT_READY":
      return { ...state, [action.provider]: false };
    case "RESET_ALL":
      return initialState;
    default:
      return state;
  }
};

// Context type
type AppContextType = {
  readyState: ReadyState;
  setProviderReady: (provider: ProviderName) => void;
  setProviderNotReady: (provider: ProviderName) => void;
  isAppReady: boolean;
};

const AppContext = createContext<AppContextType | null>(null);

// Custom hook to use the app context
export const useAppReady = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppReady must be used within an AppProvider");
  }
  return context;
};

// Helper to check if all providers are ready
const checkAllProvidersReady = (state: ReadyState): boolean => {
  return Object.values(state).every((ready) => ready === true);
};

type AppProviderProps = {
  children: ReactNode;
};

export const AppProvider = ({ children }: AppProviderProps) => {
  const [readyState, dispatch] = useReducer(readyReducer, initialState);

  const setProviderReady = useCallback((provider: ProviderName) => {
    dispatch({ type: "SET_PROVIDER_READY", provider });
  }, []);

  const setProviderNotReady = useCallback((provider: ProviderName) => {
    dispatch({ type: "SET_PROVIDER_NOT_READY", provider });
  }, []);

  const isAppReady = checkAllProvidersReady(readyState);

  // Hide splash screen when all providers are ready
  useEffect(() => {
    if (isAppReady) {
      const hideSplashScreen = async () => {
        try {
          await SplashScreen.hideAsync();
        } catch (error) {
          console.warn("Error hiding splash screen:", error);
        }
      };
      hideSplashScreen();
    }
  }, [isAppReady]);

  const contextValue: AppContextType = {
    readyState,
    setProviderReady,
    setProviderNotReady,
    isAppReady,
  };

  return (
    <AppContext.Provider value={contextValue}>{children}</AppContext.Provider>
  );
};