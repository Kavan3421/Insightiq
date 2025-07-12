const roleMiddleware = (requiredRoles) => {
  return (req, res, next) => {
    const userRole = req.userRole;

    if (!requiredRoles.includes(userRole)) {
      return res.status(403).json({ error: "Forbidden: Access denied" });
    }

    next();
  };
};

export default roleMiddleware;
