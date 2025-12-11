import { validationResult } from 'express-validator';
import { emailExists, saveUser, getAllUsers, getUserById, updateUser, deleteUser } from '../../models/forms/registration.js';

/**
 * Display the registration form
 */
const showRegistrationForm = (req, res) => {
    // TODO: Add registration-specific styles using res.addStyle()
    addRegistrationSpecificStyles(res);
    // TODO: Render the registration form view (forms/registration/form)
    res.render('forms/registration/form', {
        title: "Register",
    })
};

/**
 * Process user registration submission
 */
const processRegistration = async (req, res) => {

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.redirect('/register');
    }

    const {name, email, password} = req.body;

    const emailCheck = await emailExists(email);    
    

    if (emailCheck) {
        return res.redirect('/register');
    }

    const savedForm = await saveUser(name, email, password);

    if (!savedForm) {
        return res.redirect('/register');
    }

    res.redirect('/login')
};

const addRegistrationSpecificStyles = (res) => {
    res.addStyle('<link rel="stylesheet" href="/css/pages/registration.css">')
}

export { showRegistrationForm, processRegistration};
