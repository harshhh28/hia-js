export const setCookie = (res, accessToken, refreshToken) => {
  // Set access token cookie (short-lived)
  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    maxAge: 60 * 60 * 1000, // 1 hour
    path: "/",
  });

  // Set refresh token cookie (long-lived)
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    path: "/",
  });
};
