const express = require("express");
const router = new express.Router();
const AuthUserData = require("./models/conn");
const bcrypt = require("bcryptjs");
const cookieParser = require("cookie-parser");
const auth = require("./middleware/auth");


// middleware 
router.use(express.json());
router.use(cookieParser());
router.use(express.urlencoded({ extended: false }));

// router get all link 

router.get("/", (req, res) => {
    res.status(201).render("index");
})

router.get("/services", auth , (req, res) => {
    res.status(201).render("services");
})

router.get("/map", auth , (req, res) => {
    res.status(201).render("map");
})

router.get("/registration", (req, res) => {
    res.status(201).render("registration");
})

router.get("/login", (req, res) => {
    res.status(201).render("login");
})

router.get("/logout", auth, async (req, res) => {
    try
    {
        req.userMatch.filter((val) => {
            return val.token !== req.token;
        })
        // req.userMatch.tokens = []; //delete all drive data or cookie
        res.clearCookie("jwt");
        await req.userMatch.save();
        res.status(201).render("logout");
    } catch (error) {
        res.status(404).render("error404" , {para : error})
    }
})

router.get("/404", (req, res) => {
    res.status(201).render("error404");
})

router.get("/501", (req, res) => {
    res.status(201).render("error501");
})

router.get("/register-api", async (req, res) => {
    try
    {
        const getData = await AuthUserData.find({});
        res.status(201).send(getData);
        
    } catch (error) {
        res.status(501).render("error501" , {para : error});
    }
})

// router post 

router.post("/registration", async (req, res) => {
    try
    {
        const password = req.body.password;
        const confirmpassword = req.body.confirmpassword;
        if (password === confirmpassword)
        {
            const UserPostData = new AuthUserData({
                firstname: req.body.firstname,
                lastname: req.body.lastname,
                email: req.body.email,
                number: req.body.number,
                password: password,
                confirmpassword: confirmpassword
            });

            const token = await UserPostData.tokengenerator();
            res.cookie("jwt", token, {
                expires: new Date(Date.now() + 50000),
                httpOnly: true
            });

            const tokken = req.cookies.jwt;
            console.log(tokken);

            await UserPostData.save();
            res.status(201).render("index");
        }
    } catch (error) {
        res.status(501).render("error501" , {para : error});
        console.log(error);
    }
})


router.post("/login", async (req, res) => {
    try
    {
        const email = req.body.email;
        const password = req.body.password;
        const userMail = await AuthUserData.findOne({ email });
        const isMatch = await bcrypt.compare( password, userMail.password);
        
        const token = await userMail.tokengenerator();
            res.cookie("jwt", token, {
                expires: new Date(Date.now() + 50000),
                httpOnly: true
                // secure : true
            });

        isMatch ? res.status(201).render("index") : res.status(404).render("error404" , {para : "invalid password"});
        
    } catch (error) {
        res.status(501).render("error501" , {para : error});
        console.log(error);
    }
})



// export router 

module.exports = router;