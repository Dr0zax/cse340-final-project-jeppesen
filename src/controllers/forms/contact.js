const showContactForm = (req, res) => {
    addContactSpecificStyles(res);
    res.render('forms/contact/form', {
        title: 'Contact Us'
    })
}

const addContactSpecificStyles = (res) => {
    res.addStyle('<link rel="stylesheet" href="/css/contact.css">')
}

export { showContactForm }