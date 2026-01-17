const activeGuard = (req, res, next) => {
  // authMiddleware already put user into req.user
  if (req.user.is_active === 1) {
    next(); // user allowed
  } else {
    res.status(403).json({ message: "Account is inactive" });
  }
};

module.exports = activeGuard;
//abl kna amlin table student  w crad operations  laandon esmna layer bedna na3ml al api zeeton w n2son al tasks la kl api hasb li ana amlo 