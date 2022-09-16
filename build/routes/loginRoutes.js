"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = require("express");
const router = (0, express_1.Router)();
exports.router = router;
router.get("/login", (req, res) => {
    res.send(`
    <form method='POST'>
        <label for="email">Email:</label><br>
        <input type="email" id="email" name="email"><br>
        <label for="password">Password:</label><br>
        <input type="password" id="password" name="password"><br>
        <button type="submit">Login</button>
    </form>
    `);
});
router.post("/login", (req, res) => {
    const { email, password } = req.body;
    if (email) {
        // res.send(email + password);
        req.session = { loggedIn: true };
        res.redirect(`/`);
    }
    else {
        res.send("You must enter a valid email");
    }
});
function requireAuth(req, res, next) {
    if (req.session && req.session.loggedIn) {
        next();
        return;
    }
    res.status(403);
    res.send("Not authorized");
}
router.get("/", (req, res) => {
    console.log(req.session);
    if (req.session && req.session.loggedIn) {
        res.send(`Logged in`);
    }
    else {
        res.send(`Not logged in`);
    }
});
router.get("/logout", (req, res) => {
    if (req.session && req.session.loggedIn) {
        req.session.loggedIn = false;
        res.redirect("/login");
    }
});
router.get("/protected", requireAuth, (req, res) => {
    res.send(`Welcome`);
});
