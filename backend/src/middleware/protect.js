import jwt from "jsonwebtoken";

//verifica os token nos cookies, se existe ele libera que a resposta seja
//enviada

export const protect = (req, res, next) => {
  try {
    const token = req.cookies.token;

    if(!token) {
      return res.status(401).json({ message: `Not authorized, no token`});
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch (error){
    console.log(error);
    res.status(401).json({ message: `Not authorized, token failed`});
  }
}

