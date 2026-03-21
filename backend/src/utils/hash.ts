import bcrypt from "bcryptjs";

export const hashValue = async (value: string) => bcrypt.hash(value, 10);
export const compareValue = async (value: string, hashedValue: string) =>
  bcrypt.compare(value, hashedValue);

