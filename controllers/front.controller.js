const bcrypt = require('bcrypt');
const userModel = require("../models/user.model")
const jwt = require('jsonwebtoken');
const SECRET_KEY = "blog_secret_key";
const blogModel=require("../models/blog.model")
const index = async (req, res) => {
    try {
        let isUserAuthenticated = req.session.user ? true : false;
        const blogs = await blogModel.find({ status: true });
        console.log("blog",blogs)
        res.render('front/index', { isUserAuthenticated, blogs });
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
}
const detail = (req, res) => {
    res.render('front/detail')
}

const login = (req, res) => {
    res.render('front/login')
}

const loginUser = async (req, res) => {
    let user = await userModel.findOne({
        email: req.body.email
    });
   
    if (user) {

        let authenticated = await bcrypt.compare(req.body.password, user.password);

        if (authenticated) {
            const token = jwt.sign({ id: user._id, email: user.email }, SECRET_KEY, { expiresIn: "1h" });
            console.log("JWT Token:-", token)
            // res.status(200).json(token)
            req.session.user = user;
            res.redirect('/admin');
        } else {
            res.redirect('/login');
        }
    } else {
        res.redirect('/login');
    }
}

const register = (req, res) => {
    res.render('front/register')
}

const addUser = async (req, res) => {
    try {
        let user = await userModel.findOne({
            email: req.body.email
        });
        if(user){
            return res.render("front/register", { error: "Email already exists!" })

        }
        if(!user){
        let hashPassword = await bcrypt.hash(req.body.password, 10);
        await userModel.create({
            name: req.body.name,
            email: req.body.email,
            password: hashPassword,
            status: true
        })
    }

        res.redirect('/login');
    } catch (err) {

    }

}

module.exports = {
    index,
    detail,
    login,
    register,
    addUser,
    loginUser
}