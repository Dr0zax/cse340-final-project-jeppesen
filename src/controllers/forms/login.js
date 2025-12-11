import { validationResult } from 'express-validator';
import { findUserByEmail, verifyPassword } from '../../models/forms/login.js';

/**
 * Display the login form
 */
const showLoginForm = (req, res) => {
    addLoginSpecificStyles(res);
    res.render('forms/login/form', {
        title: "Log In"
    });

};

/**
 * Process login form submission
 */
const processLogin = async (req, res) => {

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.redirect('/login');
    }

 
    const { email, password } = req.body;

    const user = await findUserByEmail(email)

    if (!user) {
        return res.redirect('/login');
    }


    const passwordVerify = await verifyPassword(password, user.password);

    if (!passwordVerify) {
        return res.redirect('/login');
    }

    // SECURITY: Remove the password from the user object first!
    user.password = null;
    delete user.password;

    req.session.user = user;

    console.log('Logged In!');
    
    res.redirect('/dashboard');
};

/**
 * Handle user logout
 * 
 * NOTE: connect.sid is the default session name since we did not name the session
 * when created it in our server.js file.
 */
const processLogout = (req, res) => {
    // First, check if there is a session object on the request
    if (!req.session) {
        // If no session exists, there's nothing to destroy,
        // so we just redirect the user back to the home page
        return res.redirect('/');
    }

    // Set the success message BEFORE destroying the session

    // Call destroy() to remove this session from the store (Postgres in our case)
    req.session.destroy((err) => {
        if (err) {
            // If something goes wrong while removing the session from the DB:
            console.error('Error destroying session:', err);

            /**
            * Clear the session cookie from the browser anyway, so the client
            * doesn't keep sending an invalid session ID.
            */
            res.clearCookie('connect.sid');

            /** 
            * Normally we would respond with a 500 error since logout didn't fully succeed with code
            * similar to: return res.status(500).send('Error logging out');
            * 
            * Since this is a practice site we will redirect to the home page anyways.
            */
            return res.redirect('/');
        }

        // If session destruction succeeded, clear the session cookie from the browser
        res.clearCookie('connect.sid');

        // Redirect the user to the home page
        res.redirect('/');
    });
};

/**
 * Display protected dashboard (requires login)
 */
const showDashboard = (req, res) => {
    const user = req.session.user;
    const sessionData = req.session;

    if (user.password && sessionData.password) {
        user.password = null;
        delete user.password;
        sessionData.password = null;
        delete sessionData.password;
    }


    addLoginSpecificStyles(res);

    res.render('forms/login/dashboard', {
        title: "Dashboard",
        user,
        sessionData
    })
};

const addLoginSpecificStyles = (res) => {
    res.addStyle('<link rel="stylesheet" href="/css/pages/dashboard.css">')
}

export { 
    showLoginForm, 
    processLogin, 
    processLogout, 
    showDashboard
};