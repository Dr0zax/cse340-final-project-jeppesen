import db from "./db.js";
import { hashPassword } from "./forms/registration.js";

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
  },
];

const vehicles = [
  {
    id: 1,
    make: "Toyota",
    model: "Camry",
    year: 2022,
    price: 24499.99,
    description: "Reliable midsize sedan with excellent fuel economy.",
    availability: true,
    category_id: 1,
  },
  {
    id: 2,
    make: "Honda",
    model: "CRV",
    year: 2021,
    price: 28950.0,
    description: "Compact SUV with spacious interior and great reliability.",
    availability: true,
    category_id: 2,
  },
  {
    id: 3,
    make: "Ford",
    model: "F-150",
    year: 2020,
    price: 34999.0,
    description: "Full-size pickup truck with exceptional towing capabilities.",
    availability: true,
    category_id: 3,
  },
  {
    id: 4,
    make: "Tesla",
    model: "Model 3",
    year: 2023,
    price: 39999.99,
    description: "All-electric sedan with cutting-edge technology.",
    availability: true,
    category_id: 4,
  },
  {
    id: 5,
    make: "Subaru",
    model: "Outback",
    year: 2019,
    price: 22750.0,
    description: "Rugged crossover SUV with standard AWD.",
    availability: false,
    category_id: 2,
  },
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

const createReviewsTableIfNotExists = `
    CREATE TABLE IF NOT EXISTS reviews (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL REFERENCES users(id),
        vehicle_id INTEGER NOT NULL REFERENCES vehicles(id),
        rating INTEGER CHECK (rating >= 1 AND rating <= 5),
        comment TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
`;

const createServiceRequestsTableIfNotExists = `
    CREATE TABLE IF NOT EXISTS service_requests (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL REFERENCES users(id),
        vehicle_id INTEGER NOT NULL REFERENCES vehicles(id),
        service_type VARCHAR(200) NOT NULL,
        status VARCHAR(100) NOT NULL DEFAULT 'pending',
        notes TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
`;

const createContactTableIfNotExists = `
    CREATE TABLE IF NOT EXISTS contact_form (
        id SERIAL PRIMARY KEY,
        name VARCHAR(200) NOT NULL,
        email VARCHAR(200) NOT NULL,
        message TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
`;

const createUsersTableIfNotExists = `
    CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
`;

const createRolesTableIfNotExists = `
    CREATE TABLE IF NOT EXISTS roles (
        id SERIAL PRIMARY KEY,
        role_name VARCHAR(50) UNIQUE NOT NULL,
        role_description TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
`;

const addRoleIdToUsersIfNotExists = `
    DO $$
    BEGIN
        IF NOT EXISTS (
            SELECT 1 FROM information_schema.columns
            WHERE table_name='users' AND column_name='role_id'
        ) THEN
            ALTER TABLE users
            ADD COLUMN role_id INT REFERENCES roles(id);
        END IF;
    END $$;
`;

const createSlug = (...values) => {
  return values
    .filter((v) => v !== undefined && v !== null && v !== "") // remove null/undefined/empty
    .map((v) => String(v)) // coerce numbers and other primitives to string
    .join(" ") // Join all strings with spaces
    .toLowerCase()
    .replace(/\s+/g, "-") // Replace spaces with hyphens
    .replace(/[^a-z0-9\-]/g, "") // Remove special characters except hyphens
    .replace(/-+/g, "-") // Replace multiple consecutive hyphens with single hyphen
    .replace(/^-|-$/g, ""); // Remove leading/trailing hyphens
};

const insertCategory = async (entry, verbose = true) => {
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
    console.log(
      `Created/Updated categories option: ${result.rows[0].id} | ${result.rows[0].name}`
    );
  }
  return result.rows[0];
};

const insertVehicle = async (vehicle, verbose) => {
  const slug = createSlug(vehicle.make, vehicle.model, vehicle.year.toString(), vehicle.id.toString());

  const { category_id } = vehicle;
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

  const values = [
    vehicle.make,
    vehicle.model,
    vehicle.year,
    vehicle.price,
    vehicle.description,
    vehicle.availability,
    category_id,
    slug,
  ];

  const result = await db.query(query, values);

  if (result.rows.length > 0 && verbose) {
    console.log(
      `Created/Updated vehicles option: ${result.rows[0].make} - ${result.rows[0].model} - ${result.rows[0].year}`
    );
  }
  return result.rows[0];
};

const instertReviewsForm = async (reviewEntry, verbose = true) => {
    try {
        await db.query(createReviewsTableIfNotExists);
        if (verbose) {
            console.log("reviews_form created or already exists.");
        }
    } catch (error) {
        console.error("Error creating reviews_form table:", error);
    }
}

const instertServiceRequestsForm = async (serviceRequestEntry, verbose = true) => {
    try {
        await db.query(createServiceRequestsTableIfNotExists);
        if (verbose) {
            console.log("service_requests_form created or already exists.");
        }
    } catch (error) {
        console.error("Error creating service_requests_form table:", error);
    }
};

// Execute the SQL to create a contact_form table
const insertContactForm = async (verbose = true) => {
    try {
        await db.query(createContactTableIfNotExists);
        if (verbose) {
            console.log('contact_form table created/exists');
        }
    } catch (error) {
        if (verbose) {
            console.error('Failed to create or verify contact_form table:', error);
        }
    }
};

const insertUsersTable = async (verbose = true) => {
    try {
        await db.query(createUsersTableIfNotExists);
        if (verbose) {
            console.log('users table created/exists');
        }
    } catch (error) {
        if (verbose) {
            console.error('Failed to create or verify users table:', error);
        }
    }
};

const createRolesTable = async (verbose = true) => {
    try {
        await db.query(createRolesTableIfNotExists);
        if (verbose) {
            console.log('roles table created/exists');
        }
    } catch (error) {
        if (verbose) {
            console.error('Failed to create or verify roles table:', error);
        }
    }
};

const addRoleIdColumnToUsers = async (verbose = true) => {
    try {
        await db.query(addRoleIdToUsersIfNotExists);
        if (verbose) {
            console.log('role_id column add to users table/exists');
        }
    } catch (error) {
        if (verbose) {
            console.error('Failed to add role_id column to users:', error);
        }
    }
}

// Seed roles and test users
const seedRolesAndUsers = async (verbose = true) => {
    try {
        // Check if roles exist
        const roleCheck = await db.query('SELECT COUNT(*) FROM roles');
        const roleCount = parseInt(roleCheck.rows[0].count);

        if (roleCount === 0) {
            // No roles exist, insert them
            await db.query(`
                INSERT INTO roles (role_name, role_description) VALUES 
                ('user', 'Standard user with basic access'),
                ('employee', 'Can manage vehicles, reviews, and service workflows'),
                ('owner', 'Full access to all system features and settings')
            `);
            if (verbose) {
                console.log('Roles seeded: user and admin');
            }
        }

        // Get role IDs for seeding users
        const userRoleResult = await db.query(
            "SELECT id FROM roles WHERE role_name = 'user'"
        );
         const employeeRoleResult = await db.query(
            "SELECT id FROM roles WHERE role_name = 'employee'"
        );
        const ownerRoleResult = await db.query(
            "SELECT id FROM roles WHERE role_name = 'owner'"
        );

        const userRoleId = userRoleResult.rows[0].id;
        const employeeRoleId = employeeRoleResult.rows[0].id;
        const ownerRoleId = ownerRoleResult.rows[0].id;

        // Update any existing users without a role_id to default user role
        const updateResult = await db.query(`
            UPDATE users 
            SET role_id = $1 
            WHERE role_id IS NULL
        `, [userRoleId]);

        if (verbose && updateResult.rowCount > 0) {
            console.log(`Updated ${updateResult.rowCount} existing user(s) to default role`);
        }
        
        //check if owner account exists
        const ownerCheck = await db.query(
            'SELECT COUNT(*) FROM users WHERE role_id = $1',
            [ownerRoleId]
        );
        const ownerCount = parseInt(ownerCheck.rows[0].count);

        if (ownerCount === 0) {
            // No owner exists, create one
            const hashedPassword = await hashPassword('Owner1234!');
            await db.query(`
                INSERT INTO users (name, email, password, role_id) 
                VALUES ($1, $2, $3, $4)
            `, ['Owner User', 'owner@example.com', hashedPassword, ownerRoleId]);
            if (verbose) {
                console.log('Owner user created: owner@example.com / Owner1234!');
            }
        }
        
        // Check if empolyee user exists
        const employeeCheck = await db.query(
            'SELECT COUNT(*) FROM users WHERE role_id = $1',
            [employeeRoleId]
        );
        const employeeCount = parseInt(employeeCheck.rows[0].count);

        if (employeeCount === 0) {
            // No employee exists, create one
            const hashedPassword = await hashPassword('Test1234!');
            await db.query(`
                INSERT INTO users (name, email, password, role_id) 
                VALUES ($1, $2, $3, $4)
            `, ['Employee User', 'employee@example.com', hashedPassword, employeeRoleId]);
            if (verbose) {
                console.log('Admin user created: employee@example.com / Test1234!');
            }
        }

        // Check how many standard users exist
        const userCheck = await db.query(
            'SELECT COUNT(*) FROM users WHERE role_id = $1',
            [userRoleId]
        );
        const userCount = parseInt(userCheck.rows[0].count);

        if (userCount < 2) {
            // Create test users if fewer than 2 exist
            const hashedPassword = await hashPassword('Test1234!');
            const usersToCreate = 2 - userCount;

            for (let i = 0; i < usersToCreate; i++) {
                const userName = `Test User ${userCount + i + 1}`;
                const userEmail = `user${userCount + i + 1}@example.com`;

                await db.query(`
                    INSERT INTO users (name, email, password, role_id) 
                    VALUES ($1, $2, $3, $4)
                `, [userName, userEmail, hashedPassword, userRoleId]);
            }

            if (verbose) {
                console.log(`Created ${usersToCreate} test user(s) with password: Test1234!`);
            }
        }

    } catch (error) {
        if (verbose) {
            console.error('Failed to seed roles and users:', error);
        }
    }
};

const allTablesExists = async () => {
  const tables = ["categories", "vehicles"];
  const res = await db.query(
    `
        SELECT table_name
        FROM information_schema.tables
        WHERE table_schema = 'public' AND table_name = ANY($1)
        `,
    [tables]
  );
  return res.rowCount === tables.length;
};

const lastSeedRowsExist = async () => {
  const lastVehicle = vehicles[vehicles.length - 1];
  const lastVehicleSlug = createSlug(
    lastVehicle.make,
    lastVehicle.model,
    lastVehicle.year,
    lastVehicle.id
  );

  console.log(lastVehicleSlug);
  
  const vehicleExists = await db.query(
    `SELECT 1 FROM vehicles WHERE slug = $1 LIMIT 1`,
    [lastVehicleSlug]
  );

  return vehicleExists.rowCount > 0;
};

const isAlreadyInitialized = async (verbose = true) => {
  if (verbose) {
    console.log("Checking existing schema");
  }

  const tablesOk = await allTablesExists();
  if (!tablesOk) {
    return false;
  }

  const rowsOk = await lastSeedRowsExist();
   
  return rowsOk;
};

const setupDatabase = async () => {
  const verbose = process.env.ENABLE_SQL_LOGGING === "true";

  try {
    // Always create all necessary tables first, regardless of whether schema exists
    await db.query(createCategoriesTableIfNotExists);
    await db.query(createVehiclesTableIfNotExists);
    await insertContactForm(verbose);
    await createRolesTable(verbose);
    await insertUsersTable(verbose);
    await addRoleIdColumnToUsers(verbose);
    await instertServiceRequestsForm(verbose);
    await instertReviewsForm(verbose);

    // Then seed data if not already initialized
    if (await isAlreadyInitialized(verbose)) {
      if (verbose) console.log('DB already initialized — skipping data seeding.');
      // Still seed roles and users even if already initialized (idempotent operation)
      await seedRolesAndUsers(verbose);
      return true;
    }

    if (verbose) console.log("Setting up database...");

    for (const category of categories) {
      await insertCategory(category, verbose);
    }

    for (const vehicle of vehicles) {
      await insertVehicle(vehicle, verbose);
    }

    // Seed roles and users after initial setup
    await seedRolesAndUsers(verbose);

    if (verbose) {
      console.log("Databse setup complete");
    }
  } catch (err) {
    console.error("Error setting up databse:", err.message);
    throw err;
  }
};

const testConnection = async () => {
  try {
    const result = await db.query("SELECT NOW() as current_time");
    console.log("Databse connection successful:", result.rows[0].current_time);
    return true;
  } catch (err) {
    console.error("Database connection failed:", err.message);
    throw err;
  }
};

export { setupDatabase, testConnection, createSlug };
