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
            ORDER BY ${orderByClause} ASC
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
 * controller for getting a list of all vehicles from the database sorted by a specific field
 * @returns a list of sorted vehicles
 */
const getSortedVehicles = async (sortBy = "year") => {
  try {
    const validSortFeilds = ["make", "model", "year", "price", "category_name"];
    if (!validSortFeilds.includes(sortBy)) {
      sortBy = "year";
    }

    let orderByClause;
    switch (sortBy) {
      case "make":
        orderByClause = "v.make";
        break;
      case "model":
        orderByClause = "v.model";
        break;
      case "year":
        orderByClause = "v.year";
        break;
      case "price":
        orderByClause = "v.price";
        break;
      default:
        orderByClause = "v.year";
    }

    const query = `
            SELECT v.id, v.make, v.model, v.year, v.price, v.description, v.slug, c.name as category_name
            FROM vehicles v 
            JOIN categories c ON v.category_id = c.id
            ORDER BY ${orderByClause}
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
    console.error("Error fetching sorted vehicles:", error);
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
    console.log(vehicle);

    return {
      id: vehicle.id,
      make: vehicle.make,
      model: vehicle.model,
      year: vehicle.year,
      price: vehicle.price,
      description: vehicle.description,
      category: vehicle.category_name,
      slug: vehicle.slug,
    };
  } catch {}
};

export { getAllVehicles, getSortedVehicles, getVehicleBySlug };
