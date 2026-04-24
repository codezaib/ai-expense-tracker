import jwt, { JwtPayload } from "jsonwebtoken";
interface TokenPayload extends JwtPayload {
  payload: {
    id: number;
    name: string;
    email: string;
  };
}
const createJWT = (payload: object) => {
  return jwt.sign(payload, process.env.JWT_SECRET as string, {
    expiresIn:
      (process.env.JWT_LIFETIME as jwt.SignOptions["expiresIn"]) || "1d",
  });
};
const isTokenValid = (token: string) =>
  jwt.verify(token, process.env.JWT_SECRET as string) as TokenPayload;
const attachCookiesToResponse = (res: any, user: object) => {
  const token = createJWT({ payload: user });

  const oneDay = 1000 * 60 * 60 * 24;

  res.cookie("token", token, {
    httpOnly: true,
    expires: new Date(Date.now() + oneDay),
    secure: process.env.NODE_ENV === "production",
    signed: true,
    sameSite: "strict",
  });
};

const removeCookies = (res: any) => {
  res.cookie("token", "logout", {
    httpOnly: true,
    expires: new Date(Date.now()),
  });
};

export { createJWT, isTokenValid, attachCookiesToResponse, removeCookies };
