import jwt from "jsonwebtoken";
import { auditLog } from "../lib/logger.js";

export const protect = (req, res, next) => {
  try {
    const token = req.cookies?.token;

    if (!token) {
      return res.status(401).json({ message: "Não autorizado." });
    }

    // algorithms fixo — previne alg:none attack e HS/RS confusion
    const decoded = jwt.verify(token, process.env.JWT_SECRET, {
      algorithms: ["HS256"],
    });

    req.user = { sub: decoded.sub, role: decoded.role, jti: decoded.jti };
    next();
  } catch (err) {
    auditLog.warn(
      { ip: req.ip, ua: req.get("user-agent"), event: "auth_failed", err: err.message },
      "Acesso negado — token inválido ou expirado",
    );
    res.status(401).json({ message: "Token inválido ou expirado." });
  }
};
