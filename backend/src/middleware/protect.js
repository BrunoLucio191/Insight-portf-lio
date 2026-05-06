import jwt from "jsonwebtoken";

export const protect = (req, res, next) => {
  try {
    const token = req.cookies?.token;

    if (!token) {
      return res.status(401).json({ message: "Não autorizado." });
    }

    // algorithms fixo — previne alg:none attack e HS/RS confusion
    jwt.verify(token, process.env.JWT_SECRET, { algorithms: ["HS256"] });
    next();
  } catch {
    res.status(401).json({ message: "Token inválido ou expirado." });
  }
};

