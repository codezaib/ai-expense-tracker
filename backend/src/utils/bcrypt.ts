import bcrpyt from "bcryptjs";

const hashPassword: (password: string) => Promise<string> = async (
  password: string,
) => {
  const salt = await bcrpyt.genSalt(10);
  const hashedPassword = await bcrpyt.hash(password, salt);
  return hashedPassword;
};

const comparePassword: (
  password: string,
  hashedPassword: string,
) => Promise<boolean> = async (password: string, hashedPassword: string) => {
  const isMatch = await bcrpyt.compare(password, hashedPassword);
  return isMatch;
};

export { hashPassword, comparePassword };
