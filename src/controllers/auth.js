const User = require("../models/User");
const { StatusCodes } = require("http-status-codes");
const { BadRequestError, UnauthenticatedError } = require("../errors");

const register = async (req, res) => {

    console.log(req.body);
    //    const user = await User.create({ ...req.body });
    const user = await User.create({name: req.body.name, email: req.body.email, password: req.body.password});
    console.log(user);
    const token = user.createJWT();
    console.log(token);
    res.status(StatusCodes.CREATED).json({ user: { name: user.name }, token });
};

const login = async (req, res) => {
    // console.log("login");
    // console.log(req.body);
    const { email, password } = req.body;

    if (!email || !password) {
        throw new BadRequestError("Please provide email and password");
    }
    const user = await User.findOne({ email });
    if (!user) {
        throw new UnauthenticatedError("Invalid Credentials");
    }
    const isPasswordCorrect = await user.comparePassword(password);
    if (!isPasswordCorrect) {
        throw new UnauthenticatedError("Invalid Credentials");
    }
    // compare password
    const token = user.createJWT();
    res.status(StatusCodes.OK).json({ user: { name: user.name }, token });
};
const logout = async (req, res) => {
    try {
        req.session.destroy((err) => {
            if (err) {
                console.error("Error destroying session:", err);
                return res.status(500).json({ error: "Logout failed" });
            }

            res.json({ message: "Logout successful" });
        });
    } catch (error) {
        console.error("Logout error:", error);
        res.status(500).json({ error: "Logout failed" });
    }
};

module.exports = {
    register,
    login,
    logout
};
