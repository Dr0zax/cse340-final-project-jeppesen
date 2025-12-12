import db from "../db.js";

/**
 * controller for getting a list of all vehicles from the database
 * @returns a list of all vehicles
 */
const getAllVehicles = async () => {
  try {
    const query = `
            SELECT v.id, v.make, v.model, v.year, v.price, v.description, v.slug, c.name as category
            FROM vehicles v 
            JOIN categories c ON v.category_id = c.id
            ORDER BY v.year ASC
        `;
    const result = await db.query(query);
    return result.rows.map((vehicle) => ({
      id: vehicle.id,
      make: vehicle.make,
      model: vehicle.model,
      year: vehicle.year,
      price: vehicle.price,
      description: vehicle.description,
      category: vehicle.category_name,
      slug: vehicle.slug,
    }));
  } catch (error) {
    console.error("Error fetching all vehicles:", error);
    throw error;
  }
};

/**
 * controller for getting a list of all vehicles from the database sorted by category
 * @param {string} sortBy - the category to sort by (default is "suv")
 * @returns a list of sorted vehicles
 */
const getSortedVehicles = async (sortBy) => {
  try {
    let query;
    let params = [];

    // If caller requests 'all' (or passes a falsy value), return every
    // vehicle ordered by category name. Otherwise return vehicles for a
    // specific category (case-insensitive match).
    if (!sortBy || String(sortBy).toLowerCase() === "all") {
      query = `
            SELECT v.id, v.make, v.model, v.year, v.price, v.description, v.slug, c.name as category_name
            FROM vehicles v
            JOIN categories c ON v.category_id = c.id
            ORDER BY c.name ASC, v.make ASC, v.model ASC
        `;
    } else {
      query = `
            SELECT v.id, v.make, v.model, v.year, v.price, v.description, v.slug, c.name as category_name
            FROM vehicles v
            JOIN categories c ON v.category_id = c.id
            WHERE LOWER(c.name) = LOWER($1)
            ORDER BY v.make ASC, v.model ASC
        `;
      params = [sortBy];
    }

    const result = await db.query(query, params);
    return result.rows.map((vehicle) => ({
      id: vehicle.id,
      make: vehicle.make,
      model: vehicle.model,
      year: vehicle.year,
      price: vehicle.price,
      description: vehicle.description,
      category: vehicle.category_name,
      slug: vehicle.slug,
    }));
  } catch (error) {
    console.error("Error fetching sorted vehicles:", error);
    throw error;
  }
};


const getVehicleByCategory = async (categoryName) => {
  try {
    const query = `
            SELECT v.id, v.make, v.model, v.year, v.price, v.description, v.slug, c.name as category_name
            FROM vehicles v 
            JOIN categories c ON v.category_id = c.id
            WHERE c.name = $1
        `;
    const result = await db.query(query, [categoryName]);
    return result.rows.map((vehicle) => ({
      id: vehicle.id,
      make: vehicle.make,
      model: vehicle.model,
      year: vehicle.year,
      price: vehicle.price,
      description: vehicle.description,
      category: vehicle.category_name,
      slug: vehicle.slug,
    }));
  } catch (error) {
    console.error("Error fetching vehicle by category:", error);
    throw error;
  }
};

/**
 * controller for getting a specific vehicle by its slug from the database
 * @returns vehicle object with the specified slug
 */
const getVehicleBySlug = async (vehicleSlug) => {
  try {
    const query = `
            SELECT v.id, v.make, v.model, v.year, v.price, v.description, v.slug,
                c.name as category_name, c.id as category_id
            FROM vehicles v 
            JOIN categories c ON v.category_id = c.id
            WHERE v.slug = $1
        `;

    const result = await db.query(query, [vehicleSlug]);

    if (result.rows.length === 0) {
      return {};
    }

    const vehicle = result.rows[0];

    return {
      id: vehicle.id,
      make: vehicle.make,
      model: vehicle.model,
      year: vehicle.year,
      price: vehicle.price,
      description: vehicle.description,
      category: vehicle.category_name,
      slug: vehicle.slug,
      name: `${vehicle.make} ${vehicle.model} ${vehicle.year}`
    };
  } catch {}
};

/**
 * Get all categories from the database
 * @returns a list of all categories
 */
const getCategories = async () => {
  try {
    const query = `SELECT id, name FROM categories ORDER BY name ASC`;
    const result = await db.query(query);
    return result.rows;
  } catch (error) {
    console.error("Error fetching categories:", error);
    throw error;
  }
};

/**
 * Generate a slug from make, model, and year
 * Converts to lowercase and replaces spaces with hyphens
 */
const generateSlug = (make, model, year) => {
  return `${make}-${model}-${year}`.toLowerCase().replace(/\s+/g, '-');
};

/**
 * Add a new vehicle to the database
 * @param {string} make - Vehicle make
 * @param {string} model - Vehicle model
 * @param {number} year - Vehicle year
 * @param {number} price - Vehicle price
 * @param {string} description - Vehicle description
 * @param {number} categoryId - Category ID
 * @returns vehicle object with generated slug
 */
const addVehicle = async (make, model, year, price, description, categoryId) => {
  try {
    const slug = generateSlug(make, model, year);
    
    const query = `
      INSERT INTO vehicles (make, model, year, price, description, slug, category_id, availability)
      VALUES ($1, $2, $3, $4, $5, $6, $7, true)
      RETURNING id, make, model, year, price, description, slug, category_id
    `;
    
    const result = await db.query(query, [make, model, year, price, description, slug, categoryId]);
    
    if (result.rows.length === 0) {
      return null;
    }

    const vehicle = result.rows[0];
    return {
      id: vehicle.id,
      make: vehicle.make,
      model: vehicle.model,
      year: vehicle.year,
      price: vehicle.price,
      description: vehicle.description,
      slug: vehicle.slug,
      categoryId: vehicle.category_id
    };
  } catch (error) {
    console.error("Error adding vehicle:", error);
    throw error;
  }
};

/**
 * Delete a vehicle from the database by ID
 * @param {number} vehicleId - The ID of the vehicle to delete
 * @returns true if deletion was successful
 */
const deleteVehicle = async (vehicleId) => {
  try {
    const query = `DELETE FROM vehicles WHERE id = $1 RETURNING id`;
    const result = await db.query(query, [vehicleId]);
    
    return result.rows.length > 0;
  } catch (error) {
    console.error("Error deleting vehicle:", error);
    throw error;
  }
};

export { getAllVehicles, getSortedVehicles, getVehicleBySlug, getCategories, addVehicle, deleteVehicle };
