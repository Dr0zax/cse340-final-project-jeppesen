import { Router } from "express";
import { homePage } from "./index.js";
import { vehicleCatalogPage, vehicleDetailsPage } from './catalog/catalog.js';
import { showContactForm } from './forms/contact.js';
import { showRegistrationForm, processRegistration } from './forms/registration.js';
import { showLoginForm, processLogin, processLogout } from './forms/login.js';
import { registrationValidationRules, loginValidationRules } from "../middleware/validation/forms.js";

const router = Router();

router.get('/', homePage);

router.get('/catalog', vehicleCatalogPage);
router.get('/catalog/:vehicleSlug', vehicleDetailsPage);

router.get('/contact', showContactForm);
// router.post('/contact', contactValidation, processContactForm);

router.get('/register', showRegistrationForm);
router.post('/register', registrationValidationRules, processRegistration);
// router.get('/users', showAllUsers);

router.get("/login", showLoginForm);
router.post("/login", loginValidationRules, processLogin);
router.get("/logout", processLogout);

export default router;
