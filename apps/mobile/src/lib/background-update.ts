import * as TaskManager from 'expo-task-manager';
import * as Updates from 'expo-updates';

import { logger } from '~/lib/logger';

const BACKGROUND_UPDATE_TASK = 'background-update-task';

export interface BackgroundUpdateResult {
  updateAvailable: boolean;
  downloadedUpdate?: Updates.UpdateFetchResult;
}

TaskManager.defineTask(BACKGROUND_UPDATE_TASK, async (): Promise<BackgroundUpdateResult> => {
  try {
    logger.log('Background update task running...');
    
    // Check if we're in development mode
    if (__DEV__) {
      logger.log('Skipping update check in development mode');
      return { updateAvailable: false };
    }

    // Check for updates
    const update = await Updates.checkForUpdateAsync();
    
    if (update.isAvailable) {
      logger.log('Update available, downloading...');
      
      // Download the update
      const downloadResult = await Updates.fetchUpdateAsync();
      
      logger.log('Update downloaded successfully');
      
      return {
        updateAvailable: true,
        downloadedUpdate: downloadResult
      };
    }
    
    logger.log('No update available');
    return { updateAvailable: false };
    
  } catch (error) {
    logger.error('Background update task failed:', error);
    return { updateAvailable: false };
  }
});

export { BACKGROUND_UPDATE_TASK };