const activeGuard = (req, res, next) => {
  if (!req.user) {///3am et2kd iza user mawjud aw la 
    return res.status(401).json({ message: "Unauthorized" });//401 mb3rfak
  }

  if (req.user.is_active !== 1) {
    return res.status(403).json({ message: "User is inactive" });//402 ba3rfak bas mamnu3 tfut
  }

  next();
};

export default activeGuard;
