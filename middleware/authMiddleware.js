import jwt from 'jsonwebtoken'
import dotenv from "dotenv"

dotenv.config();

function authMiddleware(req, res, next) {
    try{
        let token = req.header("Authorization");
    if(!token){
        res.status(400).json({
            message: "token not provided",
            error: true
        })
        return
    }

    token = token.replace("Bearer ","");
    const user = jwt.verify(token,process.env.SACHIN_JWT);
    req.user = user;
    next();
    }catch(e){
         res.status(500).json({
            message: "Invalid or Expired token",
            error: true
        })
        return;
    }
}

export default authMiddleware;