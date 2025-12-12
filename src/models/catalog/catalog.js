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

export { getAllVehicles, getSortedVehicles, getVehicleBySlug };
