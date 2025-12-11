import { Router } from "express";
import { homePage } from "./index.js";
import { vehicleCatalogPage, vehicleDetailsPage } from './catalog/catalog.js';
import { showContactForm } from './forms/contact.js';
import { showRegistrationForm, processRegistration } from './forms/registration.js';
import { showLoginForm, processLogin, processLogout, showDashboard } from './forms/login.js';
import { processContactForm } from './forms/contact.js';
import { contactResponsesPage } from './admin/responses.js';
import { registrationValidationRules, loginValidationRules, contactValidation } from "../middleware/validation/forms.js";
import { requireLogin, requireRole } from "../middleware/auth.js";

const router = Router();

router.get('/', homePage);

router.get('/catalog', vehicleCatalogPage);
router.get('/catalog/:vehicleSlug', vehicleDetailsPage);

router.get('/contact', showContactForm);
router.post('/contact', contactValidation, processContactForm);

router.get('/register', showRegistrationForm);
router.post('/register', registrationValidationRules, processRegistration);

router.get("/login", showLoginForm);
router.post("/login", loginValidationRules, processLogin);
router.get("/logout", processLogout);

router.get('/dashboard', requireLogin, showDashboard);
router.get('/admin/contact-responses', requireLogin, requireRole('owner' || 'employee'), contactResponsesPage);


export default router;
