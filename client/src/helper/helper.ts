export const keys = Object.keys as <T>(o: T) => Extract<keyof T, string>[];

export const isEmpty = (object: any) => Object.keys(object).length === 0;
