import jwt from "jsonwebtoken";

export function adminAuth(req, res, next) {
  try {
    const header = req.headers.authorization;

    // 1️⃣ Missing Authorization header
    if (!header) {
      return res.status(401).json({
        success: false,
        code: "NO_AUTH_HEADER",
        message: "Authorization token is required",
      });
    }

    // 2️⃣ Expect "Bearer <token>"
    const [type, token] = header.split(" ");

    if (type !== "Bearer" || !token) {
      return res.status(401).json({
        success: false,
        code: "INVALID_FORMAT",
        message: "Invalid token format. Expected: Bearer <token>",
      });
    }

    // 3️⃣ Ensure secret is present
    if (!process.env.ADMIN_JWT_SECRET) {
      console.error("❌ ADMIN_JWT_SECRET missing from environment");
      return res.status(500).json({
        success: false,
        code: "SERVER_MISCONFIGURED",
        message: "Server misconfigured. Contact support.",
      });
    }

    // 4️⃣ Verify JWT token
    const decoded = jwt.verify(token, process.env.ADMIN_JWT_SECRET);

    // 5️⃣ Pre-expiration check (token expiring soon → warn UI)
    const now = Math.floor(Date.now() / 1000);
    const expiringSoon = decoded.exp - now < 60 * 10; // 10 minutes

    req.admin = decoded;
    req.tokenExpiringSoon = expiringSoon;

    if (expiringSoon) {
      res.setHeader("x-token-warning", "expiring-soon");
    }

    return next();
  } catch (err) {
    console.error("❌ Invalid Admin Token:", err.message);

    // Expired JWT → force logout on frontend
    if (err.name === "TokenExpiredError") {
      return res.status(401).json({
        success: false,
        code: "TOKEN_EXPIRED",
        message: "Session expired. Please login again.",
      });
    }

    // Any other JWT error
    return res.status(403).json({
        success: false,
        code: "TOKEN_INVALID",
        message: "Invalid authentication token",
    });
  }
}
