
export const searchValue = (value: string, compareValue: string) => {
  return compareValue?.toLowerCase()?.includes(value?.toLowerCase());
};

/**
 * It takes a string, removes all non-alphanumeric characters, replaces spaces with underscores, and
 * converts the result to lowercase
 * @param {string} value - The string to be converted to an id.
 * @returns A string with all non-alphanumeric characters removed and spaces replaced with underscores.
 */
export const generateId = (value: string, allowedString?: string) => {
  return value
    .replace(new RegExp(`[^a-z0-9_\\s${allowedString || ''}]`, 'gi'), '')
    .replace(/\s/g, '_')
    .toLowerCase();
};



export const arrayToObject = (data: any, fromKey: string): Record<string, any> => {
  if (isValidArray(data)) {
    return data.reduce((map: Record<string, any>, obj: any) => ((map[obj[fromKey]] = obj), map), {});
  }
  return {};
};

// function isNullOrUndefined<T>(obj: T | null | undefined): obj is null | undefined {
//   return typeof obj === "undefined" || obj === null;
// }

export const isValidArray = (value: any) => {
  return !isEmpty(value) && Array.isArray(value) && value.length;
};

/**
 * If the value is not null or undefined, return true if the object has no keys, otherwise return
 * false.
 *
 * If the value is null or undefined, return true.
 * @param {any} value - any
 * @returns The function isEmpty is being returned.
 */
export const isEmpty = (value: any) => {
  if (value) {
    return Object.keys(value).length <= 0;
  } else {
    return true;
  }
};


export function generateBaseUrl() {
  const protocol = window.location.protocol; // e.g., "http:" or "https:"
  const host = window.location.host; // e.g., "www.example.com" (hostname and port)

  return `${protocol}//${host}`;
}
