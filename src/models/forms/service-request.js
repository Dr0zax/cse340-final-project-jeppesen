import db from '../db.js';
import { getUserById } from './registration.js';

/**
 * Save a review form submission to the database
 * @param {number} user_id
 * @param {string} vehicle_description
 * @param {number} vehicle_plate
 * @param {string} status
 * @param {string} notes
 * @returns {Promise<Object|null>} The saved review entry or null
 */
const saveServiceRequestForm = async (user_id, vehicle_description, vehicle_plate, serviceType, notes) => {
    const query = `
        INSERT INTO service_requests (user_id, vehicle_description, vehicle_plate, service_type, status, notes)
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING id, user_id, vehicle_description, vehicle_plate, service_type, notes, status, created_at
    `;

    try {
        const result = await db.query(query, [user_id, vehicle_description, vehicle_plate, serviceType, "submitted", notes]);
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
const getAllServiceRequests = async () => {
    const query = `
        SELECT service_requests.id, service_requests.user_id, service_requests.vehicle_description, service_requests.vehicle_plate, service_requests.service_type, service_requests.status, service_requests.notes, service_requests.created_at
        FROM service_requests
        ORDER BY created_at DESC
    `;
    try {
        const result = await db.query(query);

        const serviceRequests = await Promise.all(result.rows.map(async (serviceRequest) => {
            const user = await getUserById(serviceRequest.user_id);

            return {
                id: serviceRequest.id,
                user_name: user ? user.name : null,
                vehicle_description: serviceRequest.vehicle_description,
                vehicle_plate: serviceRequest.vehicle_plate,
                service_type: serviceRequest.service_type,
                notes: serviceRequest.notes,
                status: serviceRequest.status,
                created_at: serviceRequest.created_at
            };
        }));

        return serviceRequests;
    } catch (error) {
        console.error('DB Error in getAllServiceRequests:', error);
        return [];
    }
};

export { saveServiceRequestForm, getAllServiceRequests };