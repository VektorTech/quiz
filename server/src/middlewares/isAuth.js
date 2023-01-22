export const isAuth = (req, res, next) => {
  if (!req.isAuthenticated || !req.isAuthenticated()) {
    return res.status(401).json({ message: "UNAUTHORIZED" });
  }
  next();
};
