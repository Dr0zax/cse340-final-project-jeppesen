import { Router } from "express";
import { homePage } from "./index.js";
import { vehicleCatalogPage, vehicleDetailsPage } from './catalog/catalog.js';
import { vehicleManagementPage, showAddVehicleForm, processAddVehicle, processDeleteVehicle } from './admin/vehicles.js';
import { showContactForm, processContactForm  } from './forms/contact.js';
import { showReviewForm, processReview, showUpdateReviewForm, processDeleteReview } from './forms/review.js';
import { showServiceRequestForm, processServiceRequest } from './forms/service-request.js';
import { showServiceRequestsPage, processUpdateServiceRequestStatus, processDeleteServiceRequest } from "./admin/service-requests.js";
import { showRegistrationForm, processRegistration } from './forms/registration.js';
import { showLoginForm, processLogin, processLogout, showDashboard } from './forms/login.js';
import { contactResponsesPage } from './admin/contact-responses.js';
import { reviewResponsesPage } from "./admin/review-responses.js";
import { userManagementPage, showEditAccountForm, processEditAccount, processDeleteAccount } from './admin/users.js';
import { registrationValidationRules, loginValidationRules, contactValidation, reviewValidation, serviceRequestValidation, vehicleValidation } from "../middleware/validation/forms.js";
import { requireLogin, requireRole } from "../middleware/auth.js";

const router = Router();

router.get('/', homePage);

router.get('/catalog', vehicleCatalogPage);
router.get('/catalog/:vehicleSlug', vehicleDetailsPage);

router.get('/contact', showContactForm);
router.post('/contact', contactValidation, processContactForm);

router.get('/review', showReviewForm);
router.post('/review', reviewValidation, processReview);
router.post('/review/:id/delete', processDeleteReview)
router.get('/reviews', reviewResponsesPage);

router.get('/service-request', requireLogin, showServiceRequestForm);
router.post('/service-request', requireLogin, serviceRequestValidation, processServiceRequest);
router.get('/service-requests', requireLogin, showServiceRequestsPage);
router.post('/service-requests/update-status', requireLogin, requireRole('owner' || 'employee'), processUpdateServiceRequestStatus);
router.post('/service-requests/:id/delete', requireLogin, processDeleteServiceRequest);

router.get('/register', showRegistrationForm);
router.post('/register', registrationValidationRules, processRegistration);

router.get("/login", showLoginForm);
router.post("/login", loginValidationRules, processLogin);
router.get("/logout", processLogout);

router.get('/dashboard', requireLogin, showDashboard);

router.get('/user/:id/edit', requireLogin, showEditAccountForm);
router.post('/user/:id/edit', requireLogin, processEditAccount);
router.post('/user/:id/delete', requireLogin, processDeleteAccount);
router.get('/admin', requireLogin, requireRole('owner' || 'employee'), showDashboard);
router.get('/admin/users', requireLogin, requireRole('owner'), userManagementPage);
router.get('/admin/contact-responses', requireLogin, requireRole('owner' || 'employee'), contactResponsesPage);

router.get('/admin/vehicles', requireLogin, requireRole('owner'), vehicleManagementPage);
router.get('/admin/vehicles/add', requireLogin, requireRole('owner'), showAddVehicleForm);
router.post('/admin/vehicles/add', requireLogin, requireRole('owner'), vehicleValidation, processAddVehicle);
router.post('/admin/vehicles/:id/delete', requireLogin, requireRole('owner'), processDeleteVehicle);


export default router;
