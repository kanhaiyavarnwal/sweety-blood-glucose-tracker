import jwt  from "jsonwebtoken";

const authMiddleware = (req, res, next) => {
    const { token } = req.headers;
  console.log("user middleware: ",token)
  if (!token) {
    return res.status(404).json(404, "token not found");
  }
  const decoded_Token = jwt.verify(token, process.env.JWT_SECRET);
  console.log("decodedToken: ",decoded_Token.userId)
  req.userId = decoded_Token.userId;
  next();
};

export { authMiddleware };
