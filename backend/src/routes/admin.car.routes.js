// Admin car routes
const express = require('express');
const router = express.Router();
const { body, param } = require('express-validator');
const carController = require('../controllers/car.controller');
const { authenticateToken } = require('../middleware/auth.middleware');
const {
  handleValidationErrors,
  sanitizeBody,
  validatePagination,
} = require('../middleware/validation.middleware');
const {
  upload,
  handleUploadErrors,
  validateFilesUploaded,
} = require('../middleware/upload.middleware');
const {
  CAR_CATEGORIES,
  CAR_CONDITIONS,
  BODY_TYPES,
  TRANSMISSION_TYPES,
  FUEL_TYPES,
  CAR_STATUS,
} = require('../config/constants');

// ============================================================================
// VALIDATION RULES
// ============================================================================

const idValidation = [
  param('id').isInt({ min: 1 }).withMessage('Invalid car ID'),
];

const createCarValidation = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Car name is required')
    .isLength({ max: 200 })
    .withMessage('Name must be less than 200 characters'),
  body('brand').trim().notEmpty().withMessage('Brand is required'),
  body('model').trim().notEmpty().withMessage('Model is required'),
  body('year')
    .isInt({ min: 1990, max: new Date().getFullYear() + 1 })
    .withMessage('Year must be between 1990 and next year'),
  body('price').isFloat({ min: 0 }).withMessage('Price must be a positive number'),
  body('category')
    .isIn(CAR_CATEGORIES)
    .withMessage(`Category must be one of: ${CAR_CATEGORIES.join(', ')}`),
  body('bodyType')
    .isIn(BODY_TYPES)
    .withMessage(`Body type must be one of: ${BODY_TYPES.join(', ')}`),
  body('condition')
    .isIn(CAR_CONDITIONS)
    .withMessage(`Condition must be one of: ${CAR_CONDITIONS.join(', ')}`),
  body('transmission')
    .isIn(TRANSMISSION_TYPES)
    .withMessage(`Transmission must be one of: ${TRANSMISSION_TYPES.join(', ')}`),
  body('fuelType')
    .isIn(FUEL_TYPES)
    .withMessage(`Fuel type must be one of: ${FUEL_TYPES.join(', ')}`),
  body('mileage').optional().isInt({ min: 0 }).withMessage('Mileage must be a positive number'),
];

const updateCarValidation = [
  body('status')
    .optional()
    .isIn(Object.values(CAR_STATUS))
    .withMessage(`Status must be one of: ${Object.values(CAR_STATUS).join(', ')}`),
  body('visibility').optional().isBoolean().withMessage('Visibility must be a boolean'),
];

// ============================================================================
// ADMIN CAR ROUTES (All protected)
// ============================================================================

/**
 * @route   GET /api/v1/admin/cars
 * @desc    Get all cars (including hidden)
 * @access  Private (Admin)
 */
router.get('/', authenticateToken, validatePagination, carController.getAdminCars);

/**
 * @route   GET /api/v1/admin/cars/meta
 * @desc    Get distinct features and tags for the picker
 * @access  Private (Admin)
 * @note    Must be declared before '/:id' so "meta" isn't parsed as an id.
 */
router.get('/meta', authenticateToken, carController.getCarMeta);

/**
 * @route   GET /api/v1/admin/cars/:id
 * @desc    Get single car by ID (admin view)
 * @access  Private (Admin)
 */
router.get(
  '/:id',
  authenticateToken,
  idValidation,
  handleValidationErrors,
  carController.getAdminCarById
);

/**
 * @route   POST /api/v1/admin/cars
 * @desc    Create new car
 * @access  Private (Admin)
 */
router.post(
  '/',
  authenticateToken,
  sanitizeBody,
  createCarValidation,
  handleValidationErrors,
  carController.createCar
);

/**
 * @route   PUT /api/v1/admin/cars/:id
 * @desc    Update car
 * @access  Private (Admin)
 */
router.put(
  '/:id',
  authenticateToken,
  sanitizeBody,
  idValidation,
  updateCarValidation,
  handleValidationErrors,
  carController.updateCar
);

/**
 * @route   DELETE /api/v1/admin/cars/:id
 * @desc    Delete car
 * @access  Private (Admin)
 */
router.delete(
  '/:id',
  authenticateToken,
  idValidation,
  handleValidationErrors,
  carController.deleteCar
);

/**
 * @route   POST /api/v1/admin/cars/:id/images
 * @desc    Upload car images
 * @access  Private (Admin)
 */
router.post(
  '/:id/images',
  authenticateToken,
  idValidation,
  handleValidationErrors,
  upload.array('images', 10),
  handleUploadErrors,
  validateFilesUploaded,
  carController.uploadCarImages
);

/**
 * @route   DELETE /api/v1/admin/cars/:id/images/:imageId
 * @desc    Delete car image
 * @access  Private (Admin)
 */
router.delete(
  '/:id/images/:imageId',
  authenticateToken,
  param('id').isInt({ min: 1 }).withMessage('Invalid car ID'),
  param('imageId').isInt({ min: 1 }).withMessage('Invalid image ID'),
  handleValidationErrors,
  carController.deleteCarImage
);

module.exports = router;
