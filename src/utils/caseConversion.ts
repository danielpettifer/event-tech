/**
 * Utility functions for converting between snake_case and camelCase
 */

/**
 * Converts a snake_case string to camelCase
 * @param str The snake_case string to convert
 * @returns The camelCase version of the string
 */
export const snakeToCamel = (str: string): string => {
  return str.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
};

/**
 * Converts a camelCase string to snake_case
 * @param str The camelCase string to convert
 * @returns The snake_case version of the string
 */
export const camelToSnake = (str: string): string => {
  return str.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
};

/**
 * Recursively converts all keys in an object from snake_case to camelCase
 * @param obj The object with snake_case keys
 * @returns A new object with all keys converted to camelCase
 */
export const convertObjectKeysToCamel = (obj: any): any => {
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }

  if (Array.isArray(obj)) {
    return obj.map(item => convertObjectKeysToCamel(item));
  }

  return Object.keys(obj).reduce((acc, key) => {
    const camelKey = snakeToCamel(key);
    acc[camelKey] = convertObjectKeysToCamel(obj[key]);
    return acc;
  }, {} as Record<string, any>);
};

/**
 * Recursively converts all keys in an object from camelCase to snake_case
 * @param obj The object with camelCase keys
 * @returns A new object with all keys converted to snake_case
 */
export const convertObjectKeysToSnake = (obj: any): any => {
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }

  if (Array.isArray(obj)) {
    return obj.map(item => convertObjectKeysToSnake(item));
  }

  return Object.keys(obj).reduce((acc, key) => {
    const snakeKey = camelToSnake(key);
    acc[snakeKey] = convertObjectKeysToSnake(obj[key]);
    return acc;
  }, {} as Record<string, any>);
};
