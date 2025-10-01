/**
 * Local Storage Service
 * Centralized service for managing localStorage operations
 * with type safety and error handling
 */

export interface UserPreferences {
  theme: 'light' | 'dark' | 'system';
  accentColor: string;
  fontSize: 'sm' | 'md' | 'lg';
  streamingEnabled: boolean;
  autoSave: boolean;
  showTimestamps: boolean;
  model: string;
  temperature: number;
  maxTokens: number;
  exportFormat: 'markdown' | 'pdf' | 'json' | 'txt';
}

export interface AppSettings {
  version: string;
  lastUpdated: Date;
  preferences: UserPreferences;
  analytics: {
    totalQuestions: number;
    totalTokensUsed: number;
    lastUsedDate: Date;
  };
}

const STORAGE_KEYS = {
  PREFERENCES: 'deepseek_preferences',
  SETTINGS: 'deepseek_settings',
  ANALYTICS: 'deepseek_analytics',
  USER_DATA: 'deepseek_user_data',
} as const;

const DEFAULT_PREFERENCES: UserPreferences = {
  theme: 'system',
  accentColor: 'blue',
  fontSize: 'md',
  streamingEnabled: true,
  autoSave: true,
  showTimestamps: true,
  model: 'deepseek-chat',
  temperature: 0.7,
  maxTokens: 2000,
  exportFormat: 'markdown',
};

/**
 * Storage Service Class
 * Provides methods for storing and retrieving application data
 */
class StorageService {
  /**
   * Get user preferences from localStorage
   */
  getPreferences(): UserPreferences {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.PREFERENCES);
      if (stored) {
        return { ...DEFAULT_PREFERENCES, ...JSON.parse(stored) };
      }
      return DEFAULT_PREFERENCES;
    } catch (error) {
      console.error('Failed to load preferences:', error);
      return DEFAULT_PREFERENCES;
    }
  }

  /**
   * Save user preferences to localStorage
   */
  savePreferences(preferences: Partial<UserPreferences>): void {
    try {
      const current = this.getPreferences();
      const updated = { ...current, ...preferences };
      localStorage.setItem(STORAGE_KEYS.PREFERENCES, JSON.stringify(updated));
      console.log('Preferences saved successfully');
    } catch (error) {
      console.error('Failed to save preferences:', error);
      throw new Error('Failed to save preferences');
    }
  }

  /**
   * Reset preferences to defaults
   */
  resetPreferences(): void {
    try {
      localStorage.setItem(STORAGE_KEYS.PREFERENCES, JSON.stringify(DEFAULT_PREFERENCES));
      console.log('Preferences reset to defaults');
    } catch (error) {
      console.error('Failed to reset preferences:', error);
    }
  }

  /**
   * Get app settings including analytics
   */
  getSettings(): AppSettings | null {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      if (stored) {
        const settings = JSON.parse(stored);
        // Convert date strings back to Date objects
        settings.lastUpdated = new Date(settings.lastUpdated);
        settings.analytics.lastUsedDate = new Date(settings.analytics.lastUsedDate);
        return settings;
      }
      return null;
    } catch (error) {
      console.error('Failed to load settings:', error);
      return null;
    }
  }

  /**
   * Save app settings
   */
  saveSettings(settings: AppSettings): void {
    try {
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
      console.log('Settings saved successfully');
    } catch (error) {
      console.error('Failed to save settings:', error);
      throw new Error('Failed to save settings');
    }
  }

  /**
   * Initialize or update analytics
   */
  updateAnalytics(data: {
    questionsAsked?: number;
    tokensUsed?: number;
  }): void {
    try {
      const settings = this.getSettings() || {
        version: '1.0.0',
        lastUpdated: new Date(),
        preferences: DEFAULT_PREFERENCES,
        analytics: {
          totalQuestions: 0,
          totalTokensUsed: 0,
          lastUsedDate: new Date(),
        },
      };

      if (data.questionsAsked) {
        settings.analytics.totalQuestions += data.questionsAsked;
      }
      if (data.tokensUsed) {
        settings.analytics.totalTokensUsed += data.tokensUsed;
      }
      settings.analytics.lastUsedDate = new Date();
      settings.lastUpdated = new Date();

      this.saveSettings(settings);
    } catch (error) {
      console.error('Failed to update analytics:', error);
    }
  }

  /**
   * Get analytics data
   */
  getAnalytics() {
    const settings = this.getSettings();
    return settings?.analytics || {
      totalQuestions: 0,
      totalTokensUsed: 0,
      lastUsedDate: new Date(),
    };
  }

  /**
   * Export all user data
   */
  exportUserData(): string {
    try {
      const data = {
        preferences: this.getPreferences(),
        settings: this.getSettings(),
        exportedAt: new Date().toISOString(),
      };
      return JSON.stringify(data, null, 2);
    } catch (error) {
      console.error('Failed to export user data:', error);
      throw new Error('Failed to export user data');
    }
  }

  /**
   * Import user data
   */
  importUserData(jsonData: string): boolean {
    try {
      const data = JSON.parse(jsonData);
      
      if (data.preferences) {
        this.savePreferences(data.preferences);
      }
      
      if (data.settings) {
        this.saveSettings(data.settings);
      }
      
      console.log('User data imported successfully');
      return true;
    } catch (error) {
      console.error('Failed to import user data:', error);
      return false;
    }
  }

  /**
   * Clear all stored data
   */
  clearAllData(): void {
    try {
      Object.values(STORAGE_KEYS).forEach(key => {
        localStorage.removeItem(key);
      });
      console.log('All data cleared');
    } catch (error) {
      console.error('Failed to clear data:', error);
    }
  }

  /**
   * Get storage usage statistics
   */
  getStorageStats(): {
    used: number;
    available: number;
    percentage: number;
  } {
    try {
      let totalSize = 0;
      for (let key in localStorage) {
        if (localStorage.hasOwnProperty(key)) {
          totalSize += localStorage[key].length + key.length;
        }
      }
      
      // LocalStorage typical limit is 5-10MB, we'll use 5MB as conservative estimate
      const limit = 5 * 1024 * 1024; // 5MB in bytes
      const used = totalSize;
      const available = limit - used;
      const percentage = (used / limit) * 100;

      return {
        used: Math.round(used / 1024), // KB
        available: Math.round(available / 1024), // KB
        percentage: Math.round(percentage * 100) / 100,
      };
    } catch (error) {
      console.error('Failed to get storage stats:', error);
      return { used: 0, available: 0, percentage: 0 };
    }
  }
}

// Export singleton instance
export const storageService = new StorageService();

// Export storage keys for direct access if needed
export { STORAGE_KEYS };

