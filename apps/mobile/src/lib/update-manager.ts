import * as BackgroundTask from "expo-background-task";
import * as TaskManager from "expo-task-manager";
import * as Updates from "expo-updates";
import { AppState, AppStateStatus } from "react-native";

import { BACKGROUND_UPDATE_TASK } from "~/lib/background-update";
import { logger } from "~/lib/logger";

class UpdateManager {
  private appStateSubscription: any;
  private backgroundTaskIsRegistered = false;
  private wasInBackground = false;

  async initialize() {
    try {
      // Register the background task
      await this.registerBackgroundTask();

      // Set up app state change listener
      this.setupAppStateListener();

      logger.log("Update manager initialized successfully");
    } catch (error) {
      logger.error("Failed to initialize update manager:", error);
    }
  }

  private async registerBackgroundTask() {
    try {
      if (this.backgroundTaskIsRegistered) {
        return;
      }

      // Check if the task is already registered
      const isRegistered = await TaskManager.isTaskRegisteredAsync(
        BACKGROUND_UPDATE_TASK,
      );

      if (!isRegistered) {
        await BackgroundTask.registerTaskAsync(BACKGROUND_UPDATE_TASK, {
          minimumInterval: 60000, // 1 minute minimum interval
          stopOnTerminate: false,
          startOnBoot: true,
        });

        logger.log("Background task registered");
      }

      this.backgroundTaskIsRegistered = true;
    } catch (error) {
      logger.error("Failed to register background task:", error);
    }
  }

  private setupAppStateListener() {
    this.appStateSubscription = AppState.addEventListener(
      "change",
      this.handleAppStateChange,
    );
  }

  private handleAppStateChange = async (nextAppState: AppStateStatus) => {
    logger.log("App state changed to:", nextAppState);

    if (nextAppState === "background") {
      this.wasInBackground = true;
    } else if (nextAppState === "active" && this.wasInBackground) {
      // App came back to foreground from background
      this.wasInBackground = false;
      await this.checkForUpdatesOnForeground();
    }
  };

  private async checkForUpdatesOnForeground() {
    try {
      if (__DEV__) {
        logger.log("Skipping foreground update check in development mode");
        return;
      }

      logger.log("Checking for updates on app foreground...");

      const update = await Updates.checkForUpdateAsync();

      if (update.isAvailable) {
        logger.log("Update available, fetching...");
        await Updates.fetchUpdateAsync();

        // Optionally show a notification or reload immediately
        // For now, we'll just log that an update is ready
        logger.log("Update fetched and ready to apply");

        // You can choose to reload immediately or wait for next app launch
        // await Updates.reloadAsync();
      }
    } catch (error) {
      logger.error("Error checking for updates on foreground:", error);
    }
  }

  async checkForUpdatesNow() {
    try {
      if (__DEV__) {
        logger.log("Skipping manual update check in development mode");
        return { isAvailable: false };
      }

      logger.log("Manual update check requested...");

      const update = await Updates.checkForUpdateAsync();

      if (update.isAvailable) {
        logger.log("Update available, downloading...");
        await Updates.fetchUpdateAsync();
        logger.log("Update downloaded successfully");
      }

      return update;
    } catch (error) {
      logger.error("Manual update check failed:", error);
      return { isAvailable: false };
    }
  }

  async applyUpdateNow() {
    try {
      if (__DEV__) {
        logger.log("Cannot apply updates in development mode");
        return;
      }

      logger.log("Applying update now...");
      await Updates.reloadAsync();
    } catch (error) {
      logger.error("Failed to apply update:", error);
    }
  }

  cleanup() {
    if (this.appStateSubscription) {
      this.appStateSubscription.remove();
      this.appStateSubscription = null;
    }
  }
}

export const updateManager = new UpdateManager();
