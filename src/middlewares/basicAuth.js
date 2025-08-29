// Simple Basic Auth middleware with role checks
const User = require("../models/user.model");
const bcrypt = require("bcrypt");
function basicAuth(allowedRoles = []) {
  return async (req, res, next) => {
    try {
      const header = req.headers["authorization"];
      if (!header || !header.startsWith("Basic ")) {
        const err = new Error("Missing Basic auth header");
        err.status = 401;
        return next(err);
      }

      const base64 = header.split(" ")[1];
      const [username, password] = Buffer.from(base64, "base64")
        .toString("utf8")
        .split(":");

      // Phase 1: check against .env admin
      if (username === process.env.ADMIN_USER && password === process.env.ADMIN_PASS) {
        req.user = { role: "admin", email: `${username}@local` };
      } else {
        const user = await User.findOne({ where: { email: username } });
        if (!user) {
          const err = new Error("Invalid credentials");
          err.status = 403;
          return next(err);
        }
        const ok = await bcrypt.compare(password, user.password);
        if (!ok) {
          const err = new Error("Invalid credentials");
          err.status = 403;
          return next(err);
        }
        req.user = { id: user.id, role: user.role, email: user.email };
      }

      if (allowedRoles.length && !allowedRoles.includes(req.user.role)) {
        const err = new Error("Forbidden");
        err.status = 403;
        return next(err);
      }

      next();
    } catch (err) {
      next(err);
    }
  };
}


module.exports = basicAuth;
