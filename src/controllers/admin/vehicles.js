import { validationResult } from 'express-validator';
import { getSortedVehicles, getCategories, addVehicle, deleteVehicle } from '../../models/catalog/catalog.js';

/**
 * Display the vehicle management page (list of all vehicles)
 * Accessible only to owners
 */
const vehicleManagementPage = async (req, res) => {
    try {
        const vehicles = await getSortedVehicles('all');
        addVehicleManagementStyles(res);
        res.render('admin/vehicles/list', { title: "Vehicle Management", vehicles });
    } catch (error) {
        console.error("Error loading vehicle management page:", error);
        res.status(500).render('errors/500', { title: "Server Error" });
    }
};

/**
 * Display the add vehicle form
 * Accessible only to owners
 */
const showAddVehicleForm = async (req, res) => {
    try {
        const categories = await getCategories();
        addVehicleManagementStyles(res);
        res.render('admin/vehicles/add', { 
            title: "Add Vehicle",
            categories
        });
    } catch (error) {
        console.error("Error loading add vehicle form:", error);
        res.status(500).render('errors/500', { title: "Server Error" });
    }
};

/**
 * Process vehicle form submission (add new vehicle)
 * Validates form data and inserts into database
 */
const processAddVehicle = async (req, res) => {
    try {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.redirect('/admin/vehicles/add');
        }

        const { make, model, year, price, description, category_id } = req.body;

        const newVehicle = await addVehicle(
            make,
            model,
            parseInt(year),
            parseFloat(price),
            description,
            parseInt(category_id)
        );

        if (!newVehicle) {
            return res.redirect('/admin/vehicles/add');
        }

        res.redirect('/admin/vehicles');
    } catch (error) {
        console.error("Error adding vehicle:", error);
        res.status(500).render('errors/500', { title: "Server Error" });
    }
};

/**
 * Delete a vehicle from the database
 * Only owners can delete vehicles
 */
const processDeleteVehicle = async (req, res) => {
    try {
        const vehicleId = parseInt(req.params.id);

        if (isNaN(vehicleId)) {
            return res.redirect('/admin/vehicles');
        }

        const deleted = await deleteVehicle(vehicleId);

        if (!deleted) {
            return res.redirect('/admin/vehicles');
        }
        
        res.redirect('/admin/vehicles');
    } catch (error) {
        console.error("Error deleting vehicle:", error);
        res.status(500).render('errors/500', { title: "Server Error" });
    }
};

const addVehicleManagementStyles = (res) => {
    res.addStyle('<link rel="stylesheet" href="/css/pages/vehicle-management.css">');
};

export { vehicleManagementPage, showAddVehicleForm, processAddVehicle, processDeleteVehicle };
