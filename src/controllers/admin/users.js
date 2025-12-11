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
 * Delete a user account (admin or account-owner only)
 */
const processDeleteAccount = async (req, res) => {
    const targetUserId = parseInt(req.params.id);
    const currentUser = req.session.user;

    // TODO: Verify current user is an admin
    // Only admins should be able to delete accounts
    // If not admin, set flash message and redirect
    if (currentUser.role_name !== 'owner' || currentUser.id === targetUserId) {
        return res.redirect('/dashboard');
    }

    // TODO: Prevent admins from deleting their own account
    // If targetUserId === currentUser.id, set flash message and redirect
    //
    // req.flash:
    //     type = error
    //     message = You cannot delete your own account.
    if (targetUserId === currentUser.id) {
        return res.redirect('/dashboard');
    }

    // TODO: Delete the user using deleteUser function
    // If delete fails, set flash message and redirect
    const deleteSuccess = await deleteUser(targetUserId);

    if (!deleteSuccess) {
        return res.redirect('/dashboard');
    }

    res.redirect('/dashboard');
};

const addUserManagementStyles = (res) => {
    res.addStyle('<link rel="stylesheet" href="/css/pages/users.css">');
}

export { userManagementPage, showEditAccountForm, processEditAccount, processDeleteAccount };