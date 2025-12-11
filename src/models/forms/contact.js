import db from '../db.js';

/**
 * Save a contact form submission to the database
 * @param {string} subject - The message subject
 * @param {string} message - The message content
 * @returns {Promise<Object>} The saved contact form entry
 */
const saveContactForm = async (subject, message, email) => {
    // Parameterized query: $1 and $2 are placeholders for secure data insertion
    const query = `
        INSERT INTO contact_form (subject, message, email)
        VALUES ($1, $2, $3)
        RETURNING id, subject, message, created_at
    `;

    try {
        // Pass values in array - database keeps SQL structure separate from data
        const result = await db.query(query, [subject, message, email]);
        return result.rows[0] || null;
    } catch (error) {
        console.error('DB Error in saveContactForm:', error);
        return null; // Safe fallback for controller
    }
};

/**
 * Retrieve all contact form submissions, ordered by most recent first
 * @returns {Promise<Array>} Array of contact form submissions
 */
const getAllContactForms = async () => {
    const query = `
        SELECT id, subject, message, submitted
        FROM contact_form
        ORDER BY submitted DESC
    `;

    const result = await db.query(query);
    return result.rows;
};

export { saveContactForm, getAllContactForms };