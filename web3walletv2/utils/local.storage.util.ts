import { StorageValue } from "@/types/types.wallet";

// Save a value to localStorage
const setLocalStorage = <T extends StorageValue>(
  key: string,
  value: T
): void => {
  try {
    const serializedValue = JSON.stringify(value);
    localStorage.setItem(key, serializedValue);
  } catch (error) {
    console.error(`Error setting localStorage key "${key}":`, error);
  }
};

// Retrieve a value from localStorage
const getLocalStorage = <T extends StorageValue>(key: string): T | null => {
  try {
    const item = localStorage.getItem(key);
    return item ? (JSON.parse(item) as T) : null;
  } catch (error) {
    console.error(`Error getting localStorage key "${key}":`, error);
    return null;
  }
};

// Remove a value from localStorage
const removeLocalStorage = (key: string): void => {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error(`Error removing localStorage key "${key}":`, error);
  }
};

// Update an existing value in localStorage
const updateLocalStorage = <T extends StorageValue>(
  key: string,
  newValue: Partial<T>
): void => {
  try {
    const existingValue = getLocalStorage<T>(key);
    if (
      existingValue &&
      typeof existingValue === "object" &&
      !Array.isArray(existingValue)
    ) {
      const updatedValue = { ...existingValue, ...newValue };
      setLocalStorage(key, updatedValue);
    } else {
      // If not an object, overwrite directly
      setLocalStorage(key, newValue as T);
    }
  } catch (error) {
    console.error(`Error updating localStorage key "${key}":`, error);
  }
};

// Clear all values from localStorage
const clearLocalStorage = (): void => {
  try {
    localStorage.clear();
  } catch (error) {
    console.error("Error clearing localStorage:", error);
  }
};

export {
  setLocalStorage,
  getLocalStorage,
  removeLocalStorage,
  updateLocalStorage,
  clearLocalStorage,
};
