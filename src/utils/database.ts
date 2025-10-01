/**
 * Database utilities for IndexedDB operations
 * Centralizes all database interactions with proper error handling
 */

import { DB_CONFIG } from '../config/env';

export interface ChatHistoryItem {
  id?: number;
  question: string;
  answer: string;
  timestamp: Date;
}

export interface ChatHistoryItemRaw {
  id?: number;
  question: string;
  answer: string;
  timestamp: Date | string;
}

/**
 * Initializes the IndexedDB database for storing chat history
 * @returns Promise<IDBDatabase> The initialized database
 */
export async function initDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_CONFIG.NAME, DB_CONFIG.VERSION);
    
    request.onerror = () => {
      reject(new Error('Failed to open database'));
    };
    
    request.onsuccess = () => {
      resolve(request.result);
    };
    
    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(DB_CONFIG.STORE_NAME)) {
        db.createObjectStore(DB_CONFIG.STORE_NAME, {
          keyPath: 'id',
          autoIncrement: true,
        });
      }
    };
  });
}

/**
 * Saves a question and answer pair to the database
 * @param question The user's question
 * @param answer The AI's response
 * @returns Promise<number> The ID of the saved item
 */
export async function saveToDB(question: string, answer: string): Promise<number> {
  try {
    const db = await initDB();
    const transaction = db.transaction([DB_CONFIG.STORE_NAME], 'readwrite');
    const store = transaction.objectStore(DB_CONFIG.STORE_NAME);
    
    const item: Omit<ChatHistoryItem, 'id'> = {
      question,
      answer,
      timestamp: new Date(),
    };
    
    const request = store.add(item);
    
    return new Promise((resolve, reject) => {
      request.onsuccess = () => {
        resolve(request.result as number);
      };
      request.onerror = () => {
        reject(new Error('Failed to save to database'));
      };
    });
  } catch (error) {
    console.error('Error saving to database:', error);
    throw new Error('Failed to save chat history');
  }
}

/**
 * Deletes an item from the database by ID
 * @param id The ID of the item to delete
 * @returns Promise<void>
 */
export async function deleteFromDB(id: number): Promise<void> {
  try {
    const db = await initDB();
    const transaction = db.transaction([DB_CONFIG.STORE_NAME], 'readwrite');
    const store = transaction.objectStore(DB_CONFIG.STORE_NAME);
    
    const request = store.delete(id);
    
    return new Promise((resolve, reject) => {
      request.onsuccess = () => {
        resolve();
      };
      request.onerror = () => {
        reject(new Error('Failed to delete from database'));
      };
    });
  } catch (error) {
    console.error('Error deleting from database:', error);
    throw new Error('Failed to delete chat history');
  }
}

/**
 * Retrieves all chat history items from the database
 * @returns Promise<ChatHistoryItem[]> Array of chat history items
 */
export async function getAllFromDB(): Promise<ChatHistoryItem[]> {
  try {
    const db = await initDB();
    const transaction = db.transaction([DB_CONFIG.STORE_NAME], 'readonly');
    const store = transaction.objectStore(DB_CONFIG.STORE_NAME);
    
    const request = store.getAll();
    
    return new Promise((resolve, reject) => {
      request.onsuccess = () => {
        const rawItems: ChatHistoryItemRaw[] = request.result || [];
        // Normalize timestamps (they may be strings in IndexedDB)
        const normalizedItems: ChatHistoryItem[] = rawItems.map((item) => ({
          ...item,
          timestamp: item.timestamp ? new Date(item.timestamp) : new Date(),
        }));
        
        // Sort by timestamp descending (newest first)
        normalizedItems.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
        resolve(normalizedItems);
      };
      request.onerror = () => {
        reject(new Error('Failed to retrieve from database'));
      };
    });
  } catch (error) {
    console.error('Error retrieving from database:', error);
    throw new Error('Failed to load chat history');
  }
}

/**
 * Clears all chat history from the database
 * @returns Promise<void>
 */
export async function clearAllFromDB(): Promise<void> {
  try {
    const db = await initDB();
    const transaction = db.transaction([DB_CONFIG.STORE_NAME], 'readwrite');
    const store = transaction.objectStore(DB_CONFIG.STORE_NAME);
    
    const request = store.clear();
    
    return new Promise((resolve, reject) => {
      request.onsuccess = () => {
        resolve();
      };
      request.onerror = () => {
        reject(new Error('Failed to clear database'));
      };
    });
  } catch (error) {
    console.error('Error clearing database:', error);
    throw new Error('Failed to clear chat history');
  }
}

