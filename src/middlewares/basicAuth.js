// Simple Basic Auth middleware with role checks
const User = require("../models/user.model");
const bcrypt = require("bcrypt");

function basicAuth(allowedRoles = []) {
  return async (req, res, next) => {
    try {
      const header = req.headers["authorization"];
      if (!header || !header.startsWith("Basic ")) {
        return res.status(401).json({ error: "Missing Basic auth header" });
      }

      const base64 = header.split(" ")[1];
      const [username, password] = Buffer.from(base64, "base64")
        .toString("utf8")
        .split(":");

      // Phase 1: check against .env admin
      if (username === process.env.ADMIN_USER && password === process.env.ADMIN_PASS) {
        req.user = { role: "admin", email: `${username}@local` };
      } else {
        // Phase 2: check DB user
        const user = await User.findOne({ where: { email: username } });
        if (!user) return res.status(403).json({ error: "Invalid credentials" });
        const ok = await bcrypt.compare(password, user.password);
        if (!ok) return res.status(403).json({ error: "Invalid credentials" });
        req.user = { id: user.id, role: user.role, email: user.email };
      }

      if (allowedRoles.length && !allowedRoles.includes(req.user.role)) {
        return res.status(403).json({ error: "Forbidden" });
      }
      next();
    } catch (err) {
      next(err);
    }
  };
}

module.exports = basicAuth;
