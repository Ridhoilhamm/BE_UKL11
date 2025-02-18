import jwt, { decode } from "jsonwebtoken";
import Admin from "../models/AdminModel.js";

export const refreshToken = async(req, res) =>{
    try {
        const refreshToken = req.cookies.refreshToken;
        if(!refreshToken) return res.sendStatus(401);
        const admin = await Admin.findAll({
            where: {
                refresh_token : refreshToken,
            }
        });
        if(!admin[0]) return res.sendStatus(403);
        jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, decoded)=>{
            if(err) return res.sendStatus(403);
            const id = admin[0].id;
            const name = admin[0].name;
            const email = admin[0].email;
            const role = admin[0].role;
            const accessToken = jwt.sign({id, name, email, role}, process.env.ACCESS_TOKEN_SECRET,{
                expiresIn: '1h'
            });
            res.json({accessToken});
        });
    } catch (error) {
        console.log(error);
    }
}