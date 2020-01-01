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
