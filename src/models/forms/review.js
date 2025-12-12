import db from '../db.js';
import { getVehicleBySlug } from '../catalog/catalog.js';
import { getUserById } from './registration.js';

/**
 * Save a review form submission to the database
 * @param {number} user_id
 * @param {number} vehicle_slug
 * @param {number} rating
 * @param {string} comment
 * @returns {Promise<Object|null>} The saved review entry or null
 */
const saveReviewForm = async (user_id, vehicle_slug, rating, comment) => {
    const query = `
        INSERT INTO reviews (user_id, vehicle_slug, rating, comment)
        VALUES ($1, $2, $3, $4)
        RETURNING id, user_id, vehicle_slug, rating, comment, created_at
    `;

    try {
        const result = await db.query(query, [user_id, vehicle_slug, rating, comment]);
        return result.rows[0] || null;
    } catch (error) {
        console.error('DB Error in saveReviewForm:', error);
        return null;
    }
};

/**
 * Retrieve all review submissions, ordered by most recent first
 * @returns {Promise<Array>} Array of reviews
 */
const getAllReviews = async () => {
    const query = `
        SELECT reviews.id, reviews.user_id, reviews.vehicle_slug, reviews.rating, reviews.comment, reviews.created_at
        FROM reviews
        ORDER BY created_at DESC
    `;
    try {
        const result = await db.query(query);

        const reviews = await Promise.all(result.rows.map(async (review) => {
            const user = await getUserById(review.user_id);
            const vehicle = await getVehicleBySlug(review.vehicle_slug);

            return {
                id: review.id,
                user_id: review.user_id,
                user_name: user ? user.name : null,
                vehicle_name: vehicle ? vehicle.name : null,
                vehicle_slug: review.vehicle_slug,
                rating: review.rating,
                comment: review.comment,
                created_at: review.created_at
            };
        }));

        return reviews;
    } catch (error) {
        console.error('DB Error in getAllReviews:', error);
        return [];
    }
};


/**
 * Update an existing review submission
 * @param {number} review_id
 * @param {number} rating
 * @param {string} comment
 * @returns {Promise<Object|null>} The updated review entry or null
 */
const updateReview = async (review_id, rating, comment) => {
    const query = `
        UPDATE reviews
        SET rating = $1, comment = $2
        WHERE id = $3
        RETURNING id, user_id, vehicle_slug, rating, comment, created_at
    `;

    try {
        const result = await db.query(query, [rating, comment, review_id]);
        return result.rows[0] || null;
    } catch (error) {
        console.error('DB Error in updateReview:', error);
        return null;
    }
};

export { saveReviewForm, getAllReviews, updateReview };