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
                user_id: serviceRequest.user_id,
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

/**
 * Retrieve a single service request by id
 * @param {number} request_id
 * @returns {Promise<Object|null>} Service request or null
 */
const getServiceRequestById = async (request_id) => {
    const query = `
        SELECT id, user_id, vehicle_description, vehicle_plate, service_type, status, notes, created_at
        FROM service_requests
        WHERE id = $1
    `;

    try {
        const result = await db.query(query, [request_id]);
        return result.rows[0] || null;
    } catch (error) {
        console.error('DB Error in getServiceRequestById:', error);
        return null;
    }
};

/**
 * Delete a service request by id
 * @param {number} request_id
 * @returns {Promise<Object|null>} The deleted row or null
 */
const deleteServiceRequest = async (request_id) => {
    const query = `
        DELETE FROM service_requests
        WHERE id = $1
        RETURNING id, user_id, vehicle_description, vehicle_plate, service_type, notes, status, created_at
    `;

    try {
        const result = await db.query(query, [request_id]);
        return result.rows[0] || null;
    } catch (error) {
        console.error('DB Error in deleteServiceRequest:', error);
        return null;
    }
};

/**
 * Retrieve service requests for a specific user
 * @param {number} user_id
 * @returns {Promise<Array>} Array of service requests for the user
 */
const getServiceRequestsByUserId = async (user_id) => {
    const query = `
        SELECT service_requests.id, service_requests.user_id, service_requests.vehicle_description, service_requests.vehicle_plate, service_requests.service_type, service_requests.status, service_requests.notes, service_requests.created_at
        FROM service_requests
        WHERE user_id = $1
        ORDER BY created_at DESC
    `;
    try {
        const result = await db.query(query, [user_id]);

        const serviceRequests = await Promise.all(result.rows.map(async (serviceRequest) => {
            const user = await getUserById(serviceRequest.user_id);

            return {
                id: serviceRequest.id,
                user_id: serviceRequest.user_id,
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
        console.error('DB Error in getServiceRequestsByUserId:', error);
        return [];
    }
};

/**
 * Update the status of a service request
 * @param {number} request_id
 * @param {string} status
 * @returns {Promise<Object|null>} The updated service request or null
 */
const updateServiceRequestStatus = async (request_id, status) => {
    const query = `
        UPDATE service_requests
        SET status = $1
        WHERE id = $2
        RETURNING id, user_id, vehicle_description, vehicle_plate, service_type, notes, status, created_at
    `;

    try {
        const result = await db.query(query, [status, request_id]);
        return result.rows[0] || null;
    } catch (error) {
        console.error('DB Error in updateServiceRequestStatus:', error);
        return null;
    }
};

export { saveServiceRequestForm, getAllServiceRequests, getServiceRequestsByUserId, getServiceRequestById, updateServiceRequestStatus, deleteServiceRequest };