// Car service - Business logic for car operations
const { prisma } = require('../config/database');
const { AppError } = require('../middleware/error.middleware');
const { STATUS, CAR_STATUS } = require('../config/constants');
const {
  buildCarFilters,
  buildCarSort,
  formatCarResponse,
} = require('../utils/helpers');

/**
 * Get all cars with filters and pagination
 * @param {object} filters - Filter parameters
 * @param {object} pagination - Pagination parameters
 * @param {boolean} includeHidden - Include hidden cars (admin only)
 * @returns {Promise<object>} Cars and total count
 */
const getCars = async (filters, pagination, includeHidden = false) => {
  // Build where clause
  const where = buildCarFilters({ ...filters, includeHidden });

  // Build order by clause
  const orderBy = buildCarSort(filters.sortBy);

  // Execute queries in parallel
  const [cars, total] = await Promise.all([
    prisma.car.findMany({
      where,
      orderBy,
      skip: pagination.skip,
      take: pagination.limit,
      include: {
        images: {
          orderBy: { order: 'asc' },
        },
      },
    }),
    prisma.car.count({ where }),
  ]);

  // Format response
  const formattedCars = cars.map(formatCarResponse);

  return {
    cars: formattedCars,
    total,
  };
};

/**
 * Get single car by ID
 * @param {number} id - Car ID
 * @param {boolean} includeHidden - Include hidden cars (admin only)
 * @returns {Promise<object>} Car details
 */
const getCarById = async (id, includeHidden = false) => {
  const where = { id: parseInt(id) };

  if (!includeHidden) {
    where.visibility = true;
    where.status = CAR_STATUS.AVAILABLE;
  }

  const car = await prisma.car.findFirst({
    where,
    include: {
      images: {
        orderBy: { order: 'asc' },
      },
    },
  });

  if (!car) {
    throw new AppError('Car not found', STATUS.NOT_FOUND);
  }

  return formatCarResponse(car);
};

/**
 * Create new car
 * @param {object} carData - Car data
 * @returns {Promise<object>} Created car
 */
const createCar = async (carData) => {
  // Validate required fields
  const requiredFields = ['name', 'brand', 'model', 'year', 'price', 'category', 'bodyType', 'condition', 'transmission', 'fuelType'];
  
  for (const field of requiredFields) {
    if (!carData[field]) {
      throw new AppError(`${field} is required`, STATUS.BAD_REQUEST);
    }
  }

  // Create car
  const car = await prisma.car.create({
    data: {
      ...carData,
      price: parseFloat(carData.price),
      year: parseInt(carData.year),
      mileage: parseInt(carData.mileage) || 0,
      features: carData.features || [],
      tags: carData.tags || [],
    },
    include: {
      images: true,
    },
  });

  return formatCarResponse(car);
};

/**
 * Update car
 * @param {number} id - Car ID
 * @param {object} updateData - Update data
 * @returns {Promise<object>} Updated car
 */
const updateCar = async (id, updateData) => {
  // Check if car exists
  const existingCar = await prisma.car.findUnique({
    where: { id: parseInt(id) },
  });

  if (!existingCar) {
    throw new AppError('Car not found', STATUS.NOT_FOUND);
  }

  // Prepare update data
  const data = { ...updateData };
  
  if (data.price) data.price = parseFloat(data.price);
  if (data.year) data.year = parseInt(data.year);
  if (data.mileage !== undefined) data.mileage = parseInt(data.mileage);

  // Update car
  const car = await prisma.car.update({
    where: { id: parseInt(id) },
    data,
    include: {
      images: {
        orderBy: { order: 'asc' },
      },
    },
  });

  return formatCarResponse(car);
};

/**
 * Delete car
 * @param {number} id - Car ID
 * @returns {Promise<void>}
 */
const deleteCar = async (id) => {
  // Check if car exists
  const car = await prisma.car.findUnique({
    where: { id: parseInt(id) },
    include: { images: true },
  });

  if (!car) {
    throw new AppError('Car not found', STATUS.NOT_FOUND);
  }

  // Delete images from Cloudinary
  if (car.images.length > 0) {
    const { deleteMultipleImages } = require('../config/cloudinary');
    const publicIds = car.images.map(img => img.publicId);
    
    try {
      await deleteMultipleImages(publicIds);
    } catch (error) {
      console.error('Failed to delete images from Cloudinary:', error);
      // Continue with car deletion even if image deletion fails
    }
  }

  // Delete car (cascade will delete images from DB)
  await prisma.car.delete({
    where: { id: parseInt(id) },
  });
};

/**
 * Increment car view count
 * @param {number} id - Car ID
 * @returns {Promise<void>}
 */
const incrementViews = async (id) => {
  await prisma.car.update({
    where: { id: parseInt(id) },
    data: {
      views: {
        increment: 1,
      },
    },
  });
};

/**
 * Add images to car
 * @param {number} carId - Car ID
 * @param {array} images - Array of image objects {url, publicId}
 * @returns {Promise<array>} Created images
 */
const addCarImages = async (carId, images) => {
  // Check if car exists
  const car = await prisma.car.findUnique({
    where: { id: parseInt(carId) },
  });

  if (!car) {
    throw new AppError('Car not found', STATUS.NOT_FOUND);
  }

  // Get current image count
  const existingImagesCount = await prisma.carImage.count({
    where: { carId: parseInt(carId) },
  });

  // Create images
  const createdImages = await Promise.all(
    images.map((image, index) =>
      prisma.carImage.create({
        data: {
          carId: parseInt(carId),
          url: image.url,
          publicId: image.publicId,
          isPrimary: existingImagesCount === 0 && index === 0, // First image is primary
          order: existingImagesCount + index,
        },
      })
    )
  );

  return createdImages;
};

/**
 * Delete car image
 * @param {number} carId - Car ID
 * @param {number} imageId - Image ID
 * @returns {Promise<void>}
 */
const deleteCarImage = async (carId, imageId) => {
  // Find image
  const image = await prisma.carImage.findFirst({
    where: {
      id: parseInt(imageId),
      carId: parseInt(carId),
    },
  });

  if (!image) {
    throw new AppError('Image not found', STATUS.NOT_FOUND);
  }

  // Delete from Cloudinary
  const { deleteImage } = require('../config/cloudinary');
  try {
    await deleteImage(image.publicId);
  } catch (error) {
    console.error('Failed to delete image from Cloudinary:', error);
  }

  // Delete from database
  await prisma.carImage.delete({
    where: { id: parseInt(imageId) },
  });

  // If deleted image was primary, set first remaining image as primary
  if (image.isPrimary) {
    const remainingImages = await prisma.carImage.findMany({
      where: { carId: parseInt(carId) },
      orderBy: { order: 'asc' },
      take: 1,
    });

    if (remainingImages.length > 0) {
      await prisma.carImage.update({
        where: { id: remainingImages[0].id },
        data: { isPrimary: true },
      });
    }
  }
};

/**
 * Get distinct features and tags used across all cars.
 * Powers the admin feature/tag picker suggestions.
 * @returns {Promise<{features: string[], tags: string[]}>}
 */
const getCarMeta = async () => {
  const cars = await prisma.car.findMany({
    select: { features: true, tags: true },
  });

  const featureSet = new Set();
  const tagSet = new Set();

  for (const car of cars) {
    (car.features || []).forEach((f) => {
      if (f && f.trim()) featureSet.add(f.trim());
    });
    (car.tags || []).forEach((t) => {
      if (t && t.trim()) tagSet.add(t.trim());
    });
  }

  const sortAlpha = (a, b) => a.localeCompare(b);

  return {
    features: Array.from(featureSet).sort(sortAlpha),
    tags: Array.from(tagSet).sort(sortAlpha),
  };
};

/**
 * Get unique brands with car count
 * @returns {Promise<array>} Brands with counts
 */
const getBrands = async () => {
  const brands = await prisma.car.groupBy({
    by: ['brand'],
    where: {
      visibility: true,
      status: CAR_STATUS.AVAILABLE,
    },
    _count: {
      brand: true,
    },
    orderBy: {
      brand: 'asc',
    },
  });

  return brands.map(b => ({
    brand: b.brand,
    count: b._count.brand,
  }));
};

/**
 * Get models for a specific brand
 * @param {string} brand - Brand name
 * @returns {Promise<array>} Models
 */
const getModelsByBrand = async (brand) => {
  const models = await prisma.car.groupBy({
    by: ['model'],
    where: {
      brand,
      visibility: true,
      status: CAR_STATUS.AVAILABLE,
    },
    _count: {
      model: true,
    },
    orderBy: {
      model: 'asc',
    },
  });

  return models.map(m => ({
    model: m.model,
    count: m._count.model,
  }));
};

/**
 * Get price range (min/max) from available cars
 * @returns {Promise<object>} Price range
 */
const getPriceRange = async () => {
  const result = await prisma.car.aggregate({
    where: {
      visibility: true,
      status: CAR_STATUS.AVAILABLE,
    },
    _min: {
      price: true,
    },
    _max: {
      price: true,
    },
  });

  return {
    min: parseFloat(result._min.price) || 0,
    max: parseFloat(result._max.price) || 0,
  };
};

module.exports = {
  getCars,
  getCarById,
  createCar,
  updateCar,
  deleteCar,
  incrementViews,
  addCarImages,
  deleteCarImage,
  getCarMeta,
  getBrands,
  getModelsByBrand,
  getPriceRange,
};
