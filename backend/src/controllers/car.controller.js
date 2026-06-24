// Car controller
const { STATUS } = require('../config/constants');
const { successResponse, getPaginationMeta } = require('../utils/helpers');
const { catchAsync } = require('../middleware/error.middleware');
const carService = require('../services/car.service');
const { uploadImage } = require('../config/cloudinary');

/**
 * Get all cars (public)
 * @route GET /api/v1/cars
 * @access Public
 */
const getCars = catchAsync(async (req, res) => {
  const filters = {
    search: req.query.search,
    brand: req.query.brand,
    model: req.query.model,
    category: req.query.category,
    year: req.query.year,
    condition: req.query.condition,
    transmission: req.query.transmission,
    fuelType: req.query.fuelType,
    bodyType: req.query.bodyType,
    minPrice: req.query.minPrice,
    maxPrice: req.query.maxPrice,
    minMileage: req.query.minMileage,
    maxMileage: req.query.maxMileage,
    sortBy: req.query.sortBy,
  };

  const { cars, total } = await carService.getCars(
    filters,
    req.pagination,
    false // Public: only visible cars
  );

  const meta = getPaginationMeta(total, req.pagination.page, req.pagination.limit);

  res.status(STATUS.OK).json(
    successResponse(cars, 'Cars retrieved successfully', meta)
  );
});

/**
 * Get single car by ID (public)
 * @route GET /api/v1/cars/:id
 * @access Public
 */
const getCarById = catchAsync(async (req, res) => {
  const car = await carService.getCarById(req.params.id, false);

  res.status(STATUS.OK).json(
    successResponse(car, 'Car retrieved successfully')
  );
});

/**
 * Increment car view count
 * @route POST /api/v1/cars/:id/view
 * @access Public
 */
const incrementViews = catchAsync(async (req, res) => {
  await carService.incrementViews(req.params.id);

  res.status(STATUS.OK).json(
    successResponse(null, 'View count incremented')
  );
});

/**
 * Get all cars (admin - includes hidden)
 * @route GET /api/v1/admin/cars
 * @access Private (Admin)
 */
const getAdminCars = catchAsync(async (req, res) => {
  const filters = {
    search: req.query.search,
    brand: req.query.brand,
    model: req.query.model,
    category: req.query.category,
    year: req.query.year,
    condition: req.query.condition,
    transmission: req.query.transmission,
    fuelType: req.query.fuelType,
    bodyType: req.query.bodyType,
    status: req.query.status,
    visibility: req.query.visibility,
    minPrice: req.query.minPrice,
    maxPrice: req.query.maxPrice,
    sortBy: req.query.sortBy,
  };

  const { cars, total } = await carService.getCars(
    filters,
    req.pagination,
    true // Admin: include hidden cars
  );

  const meta = getPaginationMeta(total, req.pagination.page, req.pagination.limit);

  res.status(STATUS.OK).json(
    successResponse(cars, 'Cars retrieved successfully', meta)
  );
});

/**
 * Get single car by ID (admin)
 * @route GET /api/v1/admin/cars/:id
 * @access Private (Admin)
 */
const getAdminCarById = catchAsync(async (req, res) => {
  const car = await carService.getCarById(req.params.id, true);

  res.status(STATUS.OK).json(
    successResponse(car, 'Car retrieved successfully')
  );
});

/**
 * Create new car
 * @route POST /api/v1/admin/cars
 * @access Private (Admin)
 */
const createCar = catchAsync(async (req, res) => {
  const car = await carService.createCar(req.body);

  res.status(STATUS.CREATED).json(
    successResponse(car, 'Car created successfully')
  );
});

/**
 * Update car
 * @route PUT /api/v1/admin/cars/:id
 * @access Private (Admin)
 */
const updateCar = catchAsync(async (req, res) => {
  const car = await carService.updateCar(req.params.id, req.body);

  res.status(STATUS.OK).json(
    successResponse(car, 'Car updated successfully')
  );
});

/**
 * Delete car
 * @route DELETE /api/v1/admin/cars/:id
 * @access Private (Admin)
 */
const deleteCar = catchAsync(async (req, res) => {
  await carService.deleteCar(req.params.id);

  res.status(STATUS.OK).json(
    successResponse(null, 'Car deleted successfully')
  );
});

/**
 * Upload car images
 * @route POST /api/v1/admin/cars/:id/images
 * @access Private (Admin)
 */
const uploadCarImages = catchAsync(async (req, res) => {
  // Files are in req.files (from multer)
  const uploadedImages = [];

  // Upload each file to Cloudinary
  for (const file of req.files) {
    const dataUri = `data:${file.mimetype};base64,${file.buffer.toString('base64')}`;
    const result = await uploadImage(dataUri, 'platinum-helms/cars');
    uploadedImages.push({
      url: result.url,
      publicId: result.publicId,
    });
  }

  // Save to database
  const images = await carService.addCarImages(req.params.id, uploadedImages);

  res.status(STATUS.CREATED).json(
    successResponse(images, `${images.length} image(s) uploaded successfully`)
  );
});

/**
 * Delete car image
 * @route DELETE /api/v1/admin/cars/:id/images/:imageId
 * @access Private (Admin)
 */
const deleteCarImage = catchAsync(async (req, res) => {
  await carService.deleteCarImage(req.params.id, req.params.imageId);

  res.status(STATUS.OK).json(
    successResponse(null, 'Image deleted successfully')
  );
});

/**
 * Get distinct features and tags (admin)
 * @route GET /api/v1/admin/cars/meta
 * @access Private (Admin)
 */
const getCarMeta = catchAsync(async (req, res) => {
  const meta = await carService.getCarMeta();

  res.status(STATUS.OK).json(
    successResponse(meta, 'Car metadata retrieved successfully')
  );
});

/**
 * Get brands
 * @route GET /api/v1/cars/brands
 * @access Public
 */
const getBrands = catchAsync(async (req, res) => {
  const brands = await carService.getBrands();

  res.status(STATUS.OK).json(
    successResponse(brands, 'Brands retrieved successfully')
  );
});

/**
 * Get models by brand
 * @route GET /api/v1/cars/brands/:brand/models
 * @access Public
 */
const getModelsByBrand = catchAsync(async (req, res) => {
  const models = await carService.getModelsByBrand(req.params.brand);

  res.status(STATUS.OK).json(
    successResponse(models, 'Models retrieved successfully')
  );
});

/**
 * Get price range
 * @route GET /api/v1/cars/price-range
 * @access Public
 */
const getPriceRange = catchAsync(async (req, res) => {
  const priceRange = await carService.getPriceRange();

  res.status(STATUS.OK).json(
    successResponse(priceRange, 'Price range retrieved successfully')
  );
});

module.exports = {
  getCars,
  getCarById,
  incrementViews,
  getAdminCars,
  getAdminCarById,
  createCar,
  updateCar,
  deleteCar,
  uploadCarImages,
  deleteCarImage,
  getCarMeta,
  getBrands,
  getModelsByBrand,
  getPriceRange,
};
