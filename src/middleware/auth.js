const jwt = require("jsonwebtoken");
const AuthUserData = require("../models/conn");

const auth = async (req, res, next) => {
    try
    {
        const token = req.cookies.jwt;
        const userDataAuth = jwt.verify(token, process.env.SECRET_KEY);
        const userMatch = await AuthUserData.findOne({ _id: userDataAuth._id });
        // console.log(userMatch);

        req.token = token;
        req.userMatch = userMatch;

        next();
        
        
    } catch (error) {
        console.log(error);
        res.status(501).render("error501", { para: error });
    }
}

module.exports = auth;