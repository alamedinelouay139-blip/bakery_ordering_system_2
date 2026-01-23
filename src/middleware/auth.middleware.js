import jwt from "jsonwebtoken";
import UserModel from "../models/User.js";
//middle ware yali btuaf ben al req wl controler 
//btf7as btaeml verivication btemna3 aw btsma7
//next aham shi bl middleware laan wa2fne hata nt7a2a2 mn klshi iza ma amlna enxt bi3l2 
const authGuard = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
//al header yali hat al front fii b2lbuu
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Token missing" });
    }

    const token = authHeader.split(" ")[1];//hon a nkhod al token yali bkun shklu hek bearer ....

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
//hon bl decode 3am nt2akad mnl token iza sa7 aw iza mat8yr aw iza makhls waetu 
//btrj3 object ->{
 /* id: 5,
  email: "admin@test.com",
  iat: 123456,
  exp: 123999
}*/

    const user = await UserModel.getUserById(decoded.id);
///hon am njib al user mnl model muumkn ykun user ma3mlu delete mumkn msh active mumkn adim 
    if (!user) {
      return res.status(401).json({ message: "Invalid token (user not found)" });
    }

    req.user = user;//hon 3am nrbot al user bl req al user yali jbne 
    next();
  } catch (err) {
    console.error("JWT ERROR:", err.message);
    return res.status(401).json({ message: "Invalid token" });
  }
};

export default authGuard;
