/**
 * Custom hook for managing user preferences
 * Provides centralized access to user settings with persistence
 */

import { useState, useEffect, useCallback } from 'react';
import { storageService, UserPreferences } from '../services/storageService';

export function usePreferences() {
  const [preferences, setPreferences] = useState<UserPreferences>(
    storageService.getPreferences()
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load preferences on mount
  useEffect(() => {
    try {
      const stored = storageService.getPreferences();
      setPreferences(stored);
    } catch (err) {
      console.error('Failed to load preferences:', err);
      setError('Failed to load preferences');
    }
  }, []);

  // Update a single preference
  const updatePreference = useCallback(<K extends keyof UserPreferences>(
    key: K,
    value: UserPreferences[K]
  ) => {
    try {
      setLoading(true);
      setError(null);
      
      const updated = { ...preferences, [key]: value };
      setPreferences(updated);
      storageService.savePreferences({ [key]: value });
      
      setLoading(false);
    } catch (err) {
      console.error('Failed to update preference:', err);
      setError('Failed to save preference');
      setLoading(false);
    }
  }, [preferences]);

  // Update multiple preferences at once
  const updatePreferences = useCallback((updates: Partial<UserPreferences>) => {
    try {
      setLoading(true);
      setError(null);
      
      const updated = { ...preferences, ...updates };
      setPreferences(updated);
      storageService.savePreferences(updates);
      
      setLoading(false);
    } catch (err) {
      console.error('Failed to update preferences:', err);
      setError('Failed to save preferences');
      setLoading(false);
    }
  }, [preferences]);

  // Reset to defaults
  const resetPreferences = useCallback(() => {
    try {
      setLoading(true);
      setError(null);
      
      storageService.resetPreferences();
      const defaults = storageService.getPreferences();
      setPreferences(defaults);
      
      setLoading(false);
    } catch (err) {
      console.error('Failed to reset preferences:', err);
      setError('Failed to reset preferences');
      setLoading(false);
    }
  }, []);

  // Export preferences
  const exportPreferences = useCallback((): string => {
    try {
      return storageService.exportUserData();
    } catch (err) {
      console.error('Failed to export preferences:', err);
      setError('Failed to export preferences');
      throw err;
    }
  }, []);

  // Import preferences
  const importPreferences = useCallback((jsonData: string): boolean => {
    try {
      setLoading(true);
      setError(null);
      
      const success = storageService.importUserData(jsonData);
      if (success) {
        const updated = storageService.getPreferences();
        setPreferences(updated);
      }
      
      setLoading(false);
      return success;
    } catch (err) {
      console.error('Failed to import preferences:', err);
      setError('Failed to import preferences');
      setLoading(false);
      return false;
    }
  }, []);

  return {
    preferences,
    loading,
    error,
    updatePreference,
    updatePreferences,
    resetPreferences,
    exportPreferences,
    importPreferences,
  };
}

