import db from './db.js';

const categories = [
  {
    id: 1,
    name: "Sedan",
  },
  {
    id: 2,
    name: "SUV",
  },
  {
    id: 3,
    name: "Truck",
  },
  {
    id: 4,
    name: "Electric",
  }
];


const vehicles = [
  {
      make: "Toyota",
      model: "Camry",
      year: 2022,
      price: 24499.99,
      description: "Reliable midsize sedan with excellent fuel economy.",
      availability: true,
      category_id: 1,
  },
  {
      make: "Honda",
      model: "CR-V",
      year: 2021,
      price: 28950.00,
      description: "Compact SUV with spacious interior and great reliability.",
      availability: true,
      category_id: 2,
  },
  {
      make: "Ford",
      model: "F-150",
      year: 2020,
      price: 34999.00,
      description: "Full-size pickup truck with exceptional towing capabilities.",
      availability: true,
      category_id: 3,
  },
  {
      make: "Tesla",
      model: "Model 3",
      year: 2023,
      price: 39999.99,
      description: "All-electric sedan with cutting-edge technology.",
      availability: true,
      category_id: 4,
  },
  {
      make: "Subaru",
      model: "Outback",
      year: 2019,
      price: 22750.00,
      description: "Rugged crossover SUV with standard AWD.",
      availability: false,
      category_id: 2,
}
];

const createCategoriesTableIfNotExists = `
    CREATE TABLE IF NOT EXISTS categories (
        id SERIAL PRIMARY KEY,
        name VARCHAR(200) UNIQUE NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
`;

const createVehiclesTableIfNotExists = `
    CREATE TABLE IF NOT EXISTS vehicles (
        id SERIAL PRIMARY KEY,
        category_id INTEGER NOT NULL REFERENCES categories(id),
        make VARCHAR(100) NOT NULL,
        model VARCHAR(100) NOT NULL,
        slug VARCHAR(250) UNIQUE NOT NULL,
        year INTEGER NOT NULL,
        price NUMERIC(12,2) NOT NULL,
        description TEXT,
        availability BOOLEAN NOT NULL DEFAULT TRUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
`;

const createSlug = (...strings) => {
    return strings
        .filter((str) => {
            return str && typeof str === 'string';
        }) // Remove null/undefined/non-string values
        .join(' ') // Join all strings with spaces
        .toLowerCase()
        .replace(/\s+/g, '-') // Replace spaces with hyphens
        .replace(/[^a-z0-9\-]/g, '') // Remove special characters except hyphens
        .replace(/-+/g, '-') // Replace multiple consecutive hyphens with single hyphen
        .replace(/^-|-$/g, ''); // Remove leading/trailing hyphens
};

const insertCategory = async(entry, verbose = true) => {
    const query = `
        INSERT INTO categories (id, name)
        VALUES ($1, $2)
        ON CONFLICT (id) DO UPDATE SET
            name = EXCLUDED.name,
            updated_at = CURRENT_TIMESTAMP
        RETURNING id, name;
    `;

    const values = [entry.id, entry.name];
    
    const result = await db.query(query, values);

    if (result.rows.length > 0 && verbose) {
        console.log(`Created/Updated categories option: ${result.rows[0].id} | ${result.rows[0].name}`);
    }
    return result.rows[0];
}

const instertVehicle = async(vehicle, verbose) => {
    const slug = createSlug(vehicle.make, vehicle.model, vehicle.year.toString());

    const {category_id} = vehicle;
    if (category_id === undefined || category_id === null) {
        throw new Error(`Vehicle ${slug}: category_id is required`);
    }

    const query = `
        INSERT INTO vehicles (make, model, year, price, description, availability, category_id, slug)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        ON CONFLICT (slug) DO UPDATE SET
            make = EXCLUDED.make,
            model = EXCLUDED.model,
            year = EXCLUDED.year,
            price = EXCLUDED.price,
            description = EXCLUDED.description,
            availability = EXCLUDED.availability,
            category_id = EXCLUDED.category_id,
            updated_at = CURRENT_TIMESTAMP
        RETURNING id, make, model, year, slug
    `;

    const values = [vehicle.make, vehicle.model, vehicle.year, vehicle.price, vehicle.description, vehicle.availability, category_id, slug];

    const result = await db.query(query, values);

    if (result.rows.length > 0 && verbose) {
        console.log(`Created/Updated vehicles option: ${result.rows[0].make} - ${result.rows[0].model} - ${result.rows[0].year}`);
    }
    return result.rows[0];
}

const allTablesExists = async() => {
    const tables = ['categories', 'vehicles'];
    const res = await db.query(
        `
        SELECT table_name
        FROM information_schema.tables
        WHERE table_schema = 'public' AND table_name = ANY($1)
        `,
        [tables]
    );
    return res.rowCount === tables.length;
}

const lastSeedRowsExist = async() =>  {
    const lastVehicle = vehicles[vehicles.length - 1];
    const lastVehicleSlug = createSlug(lastVehicle.make, lastVehicle.model, lastVehicle.year);
    const vehicleExists = await db.query(`SELECT 1 FROM vehicles WHERE slug = $1 LIMIT 1`, [lastVehicleSlug]);

    if (vehicleExists.rowCount === 0) return false;
}

const isAlreadyInitialized = async(verbose = true) => {
    if (verbose) {
        console.log('Checking existing schema')
    }

    const tablesOk = await allTablesExists();
    if (!tablesOk) {
        return false;
    }

    const rowsOk = await lastSeedRowsExist();
    return rowsOk;
}

const setupDatabase = async() => {
    const verbose = process.env.ENABLE_SQL_LOGGING === 'true';

    try {
        if (await isAlreadyInitialized(verbose)) {
            if (verbose) console.log('Setting up database...');
            return true;
        } 

        if (verbose) console.log('Setting up database...');
        
        await db.query(createCategoriesTableIfNotExists);
        for (const category of categories) {
            await insertCategory(category, verbose);
        }

        await db.query(createVehiclesTableIfNotExists);
        for (const vehicle of vehicles) {
            await instertVehicle(vehicle, verbose);
        }

        if (verbose) {
            console.log('Databse setup complete');
        }
    } catch (err) {
        console.error('Error setting up databse:', err.message);
        throw err;
    }
}

const testConnection = async() => {
    try {
        const result = await db.query('SELECT NOW() as current_time');
        console.log('Databse connection successful:', result.rows[0].current_time);
        return true;
    } catch (err) {
        console.error('Database connection failed:', err.message);
        throw err;
    }
}

export { setupDatabase, testConnection };