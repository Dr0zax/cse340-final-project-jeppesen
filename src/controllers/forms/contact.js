import { validationResult } from "express-validator";
import { saveContactForm, getAllContactForms } from "../../models/forms/contact.js";

const showContactForm = (req, res) => {
    addContactSpecificStyles(res);
    res.render('forms/contact/form', {
        title: 'Contact Us'
    })
}

const processContactForm = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.redirect('/contact');
    }

    const {subject, message, email} = req.body;

    const savedForm = await saveContactForm(subject, message, email);
    if (!savedForm) {
        return res.redirect('/contact');
    }

    res.redirect('/contact');
}

const addContactSpecificStyles = (res) => {
    res.addStyle('<link rel="stylesheet" href="/css/pages/contact.css">')
}

export { showContactForm, processContactForm }