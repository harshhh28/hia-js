export const clearCookie = (res) => {
  res.clearCookie("accessToken");
  res.clearCookie("refreshToken");
};
