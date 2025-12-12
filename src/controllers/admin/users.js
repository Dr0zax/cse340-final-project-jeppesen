import { validationResult } from "express-validator";
import { getAllUsers, getUserById, emailExists, updateUser, deleteUser } from "../../models/forms/registration.js";

const userManagementPage = async (req, res) => {
    const users = await getAllUsers();
    addUserManagementStyles(res);
    res.render("admin/users", { title: "User Management", users });
}

/**
 * Display the edit account form
 * Users can edit their own account, admins can edit any account
 */
const showEditAccountForm = async (req, res) => {
    const targetUserId = parseInt(req.params.id);
    const currentUser = req.session.user;

    const targetUser = await getUserById(targetUserId);

    if (!targetUser) {
        return res.redirect('/dashboard');
    }

    const canEdit = (currentUser.id === targetUserId) || (currentUser.role_name === 'owner');

    if (!canEdit) {
        return res.redirect('/dashboard');
    }

    // TODO: Render the edit form, passing the target user data
    addUserManagementStyles(res);
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
        return res.redirect(`/user/${req.params.id}/edit`);
    }

    const targetUserId = parseInt(req.params.id);
    const currentUser = req.session.user;
    const { name, email } = req.body;   

    const targetUser = await getUserById(targetUserId);
  
    if (!targetUser) {
        return res.redirect('/dashboard');
    }

    const canEdit = (currentUser.id === targetUserId) || (currentUser.role_name === 'owner') || (currentUser.role_name === 'employee');

    if (!canEdit) {
        return res.redirect('/dashboard');
    }

    // TODO: Check if the new email already exists for a DIFFERENT user
    // Hint: You need to verify the email isn't taken by someone else,
    // but it's okay if it matches the target user's current email
    // If email is taken, set flash message and redirect back to edit form
    if (email !== targetUser.email) {
        const emailInUse = await emailExists(email);
        if (emailInUse) {
            return res.redirect(`/user/${targetUserId}/edit`);
        }
    }

    const updatedUser = await updateUser(targetUserId, name, email);

    if (!updatedUser) {
        return res.redirect(`/user/${targetUserId}/edit`);
    }

    if (currentUser.id === targetUserId) {
        req.session.user.name = updatedUser.name;
        req.session.user.email = updatedUser.email;
    }

    res.redirect('/dashboard');
};

/**
 * Delete a user account (user can delete own account, owner can delete any)
 */
const processDeleteAccount = async (req, res) => {
    const targetUserId = parseInt(req.params.id);
    const currentUser = req.session.user;

    // User can delete their own account OR owner can delete any account
    const canDelete = (currentUser.id === targetUserId) || (currentUser.role_name === 'owner');

    if (!canDelete) {
        return res.redirect('/dashboard');
    }

    const deleteSuccess = await deleteUser(targetUserId);

    if (!deleteSuccess) {
        return res.redirect('/dashboard');
    }

    // If user deleted their own account, destroy session and redirect to home
    if (currentUser.id === targetUserId) {
        req.session.destroy();
        return res.redirect('/');
    }

    res.redirect('/dashboard');
};

const addUserManagementStyles = (res) => {
    res.addStyle('<link rel="stylesheet" href="/css/pages/users.css">');
}

export { userManagementPage, showEditAccountForm, processEditAccount, processDeleteAccount };