import { body } from "express-validator";

/**
 * Validation rules for registration form submission
 */
const registrationValidationRules = [
  body('name')
        .trim()
        .isLength({ min: 7 })
        .withMessage('Name must be at least 7 characters long'),

    body('email')
        .trim()
        .isEmail()
        .withMessage('Please provide a valid email address')
        .normalizeEmail(),

    body('confirmEmail')
        .trim()
        .isEmail()
        .withMessage('Please provide a valid confirmation email')
        .normalizeEmail()
        .custom((value, { req }) => {
            if (value !== req.body.email) {
                throw new Error('Email addresses do not match');
            }
            return true;
        }),

    body('password')
        .isLength({ min: 8 })
        .withMessage('Password must be at least 8 characters long')
        .matches(/^(?=.*[0-9])(?=.*[!@#$%^&*])/)
        .withMessage('Password must contain at least one number and one symbol (!@#$%^&*)'),

    body('confirmPassword')
        .custom((value, { req }) => {
            if (value !== req.body.password) {
                throw new Error('Passwords do not match');
            }
            return true;
        })
];

/**
 * Validation rules for login form submission
 */
const loginValidationRules = [
  body("email")
    .trim()
    .isEmail()
    .withMessage("Invalid email format")
    .normalizeEmail(),
  body("password")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters long"),
];

/**
 * Validation rules for contact form submission
 */
const contactValidation = [
    body('subject')
        .trim()
        .isLength({ min: 2 })
        .withMessage('Subject must be at least 2 characters long'),

    body('message')
        .trim()
        .isLength({ min: 10 })
        .withMessage('Message must be at least 10 characters long'),

    body('email')
        .trim()
        .isEmail()
        .withMessage('Please provide a valid email address')
        .normalizeEmail()
];

/**
 * Validation rules for review form submission
 */
const reviewValidation = [
    body('vehicle')
        .trim()
        .notEmpty()
        .withMessage('Please select a vehicle'),

    body('rating')
        .isInt({ min: 1, max: 5 })
        .withMessage('Rating must be between 1 and 5'),

    body('comment')
        .trim()
        .isLength({ min: 10 })
        .withMessage('Comment must be at least 10 characters long')
];

/**
 * Validation rules for service request form submission
 */
const serviceRequestValidation = [
    body('vehicle')
        .trim()
        .isLength({ min: 1 })
        .withMessage('Vehicle information is required'),

    body('vehiclePlate')
        .trim()
        .isLength({ min: 1, max: 10 })
        .withMessage('Vehicle plate must be between 1 and 10 characters'),

    body('serviceType')
        .notEmpty()
        .withMessage('Please select a service type')
        .isIn(['oil change', 'inspection', 'replace tire', 'replace windsheild'])
        .withMessage('Invalid service type selected'),

    body('notes')
        .trim()
        .isLength({ min: 10 })
        .withMessage('Notes must be at least 10 characters long')
];

/**
 * Validation rules for vehicle form submission
 */
const vehicleValidation = [
    body('make')
        .trim()
        .isLength({ min: 1, max: 50 })
        .withMessage('Make must be between 1 and 50 characters'),

    body('model')
        .trim()
        .isLength({ min: 1, max: 50 })
        .withMessage('Model must be between 1 and 50 characters'),

    body('year')
        .isInt({ min: 1900, max: 2100 })
        .withMessage('Year must be between 1900 and 2100'),

    body('price')
        .isFloat({ min: 0 })
        .withMessage('Price must be a positive number'),

    body('category_id')
        .isInt({ min: 1 })
        .withMessage('Please select a valid category'),

    body('description')
        .trim()
        .isLength({ min: 10, max: 500 })
        .withMessage('Description must be between 10 and 500 characters')
];

export { registrationValidationRules, loginValidationRules, contactValidation, reviewValidation, serviceRequestValidation, vehicleValidation };