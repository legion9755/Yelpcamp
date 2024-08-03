const User = require('../models/user');


module.exports.renderRegister =  (req, res) => {
    res.render('auth/register');
}

module.exports.registerUser = async (req, res) => {
    try {
        const { email, username, password } = req.body;
        const user = new User({ email, username });
        const registeredUser = await User.register(user, password);
        req.logIn( registeredUser, (err) => {
            if (err) return next();
            req.flash('success', 'Welcome to Yelpcamp!');
            res.redirect('/campgrounds');

        })
    }

    catch (e) {
        req.flash('error', e.message);
        res.redirect('/register');
    }

}

module.exports.renderLogin = (req, res) => {
    res.render('auth/login');
}

module.exports.loginUser = async (req, res) => {
    req.flash('success', 'Welcome back!');
    const redirectUrl = res.locals.returnTo || '/campgrounds'; // update this line to use res.locals.returnTo now
    res.redirect(redirectUrl);
    
}

module.exports.logoutUser = (req, res, next) => {
    req.logout(function (err) {
        if (err) {
            return next(err);
        }
        req.flash('success', 'Logged You Out!');
        res.redirect('/campgrounds');
    });
}