/**
 * Typed version of Object.keys()
 * @returns the keys and type of the given object
 */
export const keys = Object.keys as <T>(o: T) => Extract<keyof T, string>[];

/**
 * Checks if the passed object is empty
 * @param object - the object to check
 * @returns if the object is empty
 */
export const isEmpty = (object: any) => Object.keys(object).length === 0;

/**
 * Checks if the values in an array are all unique
 * @param data - the array to verify
 * @returns true if all values in the array are unique
 */
export const isUnique = (data: Array<any>): boolean => {
  const unique = [...new Set(data)];
  return unique.length === data.length;
};
