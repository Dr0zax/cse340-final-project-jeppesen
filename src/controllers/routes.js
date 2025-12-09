import { Router } from "express";
import { homePage } from "./index.js";
// import { vehicleCatalogPage } from './catalog/catalog.js';

const router = Router();

router.get('/', homePage);

// router.get('/catalog', vehicleCatalogPage);
// router.get('/catalog/:vehicleId', vehicleDetailPage);

// router.get('/contact', showContactForm);
// router.post('/contact', contactValidation, processContactForm);

// router.get('/register', showRegistrationForm);
// router.post('/register', registrationValidation, processRegistration);
// router.get('/users', showAllUsers);

// router.get("/login", showLoginForm);
// router.post("/login", loginValidation, processLogin);
// router.get("/logout", processLogout);

export default router;
