import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;

export const generateTokens = (user) => {
  const accessToken = jwt.sign(
    {
      data: { id: user.id, email: user.email },
    },
    JWT_SECRET,
    { expiresIn: "1h" }
  );
  const refreshToken = jwt.sign(
    {
      data: { id: user.id, email: user.email },
    },
    JWT_SECRET,
    { expiresIn: "7d" }
  );
  return { accessToken, refreshToken };
};
