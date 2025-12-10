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

/**
 * Display all registered users
 */
const showAllUsers = async (req, res) => {

    const users = await getAllUsers();

    addRegistrationSpecificStyles(res);

    res.render('forms/registration/list', {
        title: "All Registered Users",
        users: users,
        sessionData: req.session
    })
};

/**
 * Display the edit account form
 * Users can edit their own account, admins can edit any account
 */
const showEditAccountForm = async (req, res) => {
    const targetUserId = parseInt(req.params.id);
    const currentUser = req.session.user;

    // TODO: Retrieve the target user from the database using getUserById
    const targetUser = await getUserById(targetUserId);

    // TODO: Check if the target user exists
    // If not, set flash message and redirect to /users
    //
    // req.flash:
    //     type = error
    //     message = User not found.
    if (!targetUser) {
        return res.redirect('/users');
    }

    // TODO: Determine if current user can edit this account
    // Users can edit their own (currentUser.id === targetUserId)
    // Admins can edit anyone (currentUser.role_name === 'admin')
    const canEdit = (currentUser.id === targetUserId) || (currentUser.role_name === 'owner') || (currentUser.role_name === 'employee')  ;

    // TODO: If current user cannot edit, set flash message and redirect
    //
    // req.flash:
    //     type = error
    //     message = You do not have permission to edit this account.
    if (!canEdit) {
        return res.redirect('/users');
    }

    // TODO: Render the edit form, passing the target user data
    addRegistrationSpecificStyles(res);
    res.render('forms/registration/edit', {
        title: 'Edit Account',
        user: targetUser
    });
};

/**
 * Process account edit form submission
 */
const processEditAccount = async (req, res) => {
    const results = validationResult(req);

    // Check for validation errors
    if (!results.isEmpty()) {
        return res.redirect(`/users/${req.params.id}/edit`);
    }

    const targetUserId = parseInt(req.params.id);
    const currentUser = req.session.user;
    const { name, email } = req.body;

    // TODO: Retrieve the target user to verify they exist
    // If not found, set flash message and redirect to /users
    const targetUser = await getUserById(targetUserId);

    if (!targetUser) {
        return res.redirect('/users');
    }

    // TODO: Check edit permissions (same as showEditAccountForm)
    // If cannot edit, set flash message and redirect
    const canEdit = (currentUser.id === targetUserId) || (currentUser.role_name === 'owner') || (currentUser.role_name === 'employee');

    if (!canEdit) {
        return res.redirect('/users');
    }

    // TODO: Check if the new email already exists for a DIFFERENT user
    // Hint: You need to verify the email isn't taken by someone else,
    // but it's okay if it matches the target user's current email
    // If email is taken, set flash message and redirect back to edit form
    const emailOwner = await emailExists(email);

    if (emailOwner && emailOwner.id !== targetUserId) {
        return res.redirect(`/users/${targetUserId}/edit`);
    }

    // TODO: Update the user in the database using updateUser
    // If update fails, set flash message and redirect back to edit form
    const updatedUser = await updateUser(targetUserId, name, email);

    if (!updatedUser) {
        return res.redirect(`/users/${targetUserId}/edit`);
    }

    // TODO: If the current user edited their own account, update their session
    // Hint: Update req.session.user with the new name and email
    if (currentUser.id === targetUserId) {
        req.session.user.name = updatedUser.name;
        req.session.user.email = updatedUser.email;
    }

    res.redirect('/users');
};

/**
 * Delete a user account (admin only)
 */
const processDeleteAccount = async (req, res) => {
    const targetUserId = parseInt(req.params.id);
    const currentUser = req.session.user;

    // TODO: Verify current user is an admin
    // Only admins should be able to delete accounts
    // If not admin, set flash message and redirect
    if (currentUser.role_name !== 'owner' && currentUser.role_name !== 'employee') {
        return res.redirect('/users');
    }

    // TODO: Prevent admins from deleting their own account
    // If targetUserId === currentUser.id, set flash message and redirect
    //
    // req.flash:
    //     type = error
    //     message = You cannot delete your own account.
    if (targetUserId === currentUser.id) {
        return res.redirect('/users');
    }

    // TODO: Delete the user using deleteUser function
    // If delete fails, set flash message and redirect
    const deleteSuccess = await deleteUser(targetUserId);

    if (!deleteSuccess) {
        return res.redirect('/users');
    }

    res.redirect('/users');
};

const addRegistrationSpecificStyles = (res) => {
    res.addStyle('<link rel="stylesheet" href="/css/pages/registration.css">')
}

export { showRegistrationForm, processRegistration, showAllUsers, showEditAccountForm, processEditAccount, processDeleteAccount };
