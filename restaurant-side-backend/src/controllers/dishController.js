const Dish = require('../models/Dish');
const Category = require('../models/Category');
const ApiResponse = require('../utils/apiResponse');
const logger = require('../utils/logger');

// ========================================================
// @desc    Get all dishes
// @route   GET /api/v1/dishes
// @access  Public
// ========================================================
exports.getAllDishes = async (req, res, next) => {
  try {
    const {
      page = 1,
      limit = 10,
      sort = '-createdAt',
      search,
      category,
      available,
      isVegetarian,
      isVegan,
      minPrice,
      maxPrice,
      status
    } = req.query;

    const query = {};

    if (search) query.$text = { $search: search };
    if (category) query.category = category;
    if (available !== undefined) query.available = available === 'true';
    if (isVegetarian !== undefined) query.isVegetarian = isVegetarian === 'true';
    if (isVegan !== undefined) query.isVegan = isVegan === 'true';
    if (status) query.status = status;

    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = parseFloat(minPrice);
      if (maxPrice) query.price.$lte = parseFloat(maxPrice);
    }

    const dishes = await Dish.find(query)
      .populate('category', 'name icon')
      .sort(sort)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .lean();

    const total = await Dish.countDocuments(query);

    return ApiResponse.paginated(
      res,
      dishes,
      page,
      limit,
      total,
      'Dishes retrieved successfully'
    );
  } catch (error) {
    logger.error('Get all dishes error:', error);
    next(error);
  }
};

// ========================================================
// @desc    Get a single dish
// @route   GET /api/v1/dishes/:id
// @access  Public
// ========================================================
exports.getDish = async (req, res, next) => {
  try {
    const dish = await Dish.findById(req.params.id)
      .populate('category', 'name description icon');
      

    if (!dish) return ApiResponse.notFound(res, 'Dish not found');

    return ApiResponse.success(res, dish, 'Dish retrieved successfully');
  } catch (error) {
    logger.error('Get dish error:', error);
    next(error);
  }
};

// ========================================================
// @desc    Create new dish
// @route   POST /api/v1/dishes
// @access  Private (Admin/Manager)
// ========================================================
exports.createDish = async (req, res, next) => {
  try {
    const category = await Category.findById(req.body.category);
    if (!category) return ApiResponse.notFound(res, 'Category not found');

    if (req.file) {
      req.body.image = `/uploads/dishes/${req.file.filename}`;
    }

    req.body.createdBy = req.user._id;

    const dish = await Dish.create(req.body);

    await Category.findByIdAndUpdate(req.body.category, {
      $inc: { dishCount: 1 }
    });

    logger.info(`Dish created: ${dish.name} by ${req.user.email}`);

    return ApiResponse.created(res, dish, 'Dish created successfully');
  } catch (error) {
    logger.error('Create dish error:', error);
    next(error);
  }
};

// ========================================================
// @desc    Update dish
// @route   PUT /api/v1/dishes/:id
// @access  Private (Admin/Manager)
// ========================================================
exports.updateDish = async (req, res, next) => {
  try {
    const { restaurantId, id } = req.params;

    let dish = await Dish.findOne({ _id: id, restaurantId });
    if (!dish) return ApiResponse.notFound(res, 'Dish not found');

    let imageUrl = dish.imageUrl;
    let thumbnailUrl = dish.thumbnailUrl;

    // NEW IMAGE UPLOAD
    if (req.file) {
      const ext = path.extname(req.file.originalname) || '.jpg';
      const baseKey = `restaurants/${restaurantId}/dishes/${uuidv4()}`;

      // Upload original
      imageUrl = await uploadBufferToS3(
        req.file.buffer,
        S3_BUCKET,
        `${baseKey}${ext}`,
        req.file.mimetype
      );

      // Upload thumbnail
      const resized = await sharp(req.file.buffer)
        .resize(800, 800)
        .jpeg({ quality: 80 })
        .toBuffer();

      thumbnailUrl = await uploadBufferToS3(
        resized,
        S3_BUCKET,
        `${baseKey}-thumb.jpg`,
        'image/jpeg'
      );
    }

    dish = await Dish.findByIdAndUpdate(
      id,
      {
        ...req.body,
        imageUrl,
        thumbnailUrl,
        updatedAt: Date.now(),
      },
      { new: true }
    );

    return ApiResponse.success(res, dish, 'Dish updated successfully');
  } catch (err) {
    logger.error('Update dish error:', err);
    next(err);
  }
};


// ========================================================
// @desc    Delete dish
// @route   DELETE /api/v1/dishes/:id
// @access  Private (Admin)
// ========================================================
exports.deleteDish = async (req, res, next) => {
  try {
    const dish = await Dish.findById(req.params.id);
    if (!dish) return ApiResponse.notFound(res, 'Dish not found');

    await Category.findByIdAndUpdate(dish.category, {
      $inc: { dishCount: -1 }
    });

    await dish.deleteOne();

    logger.info(`Dish deleted: ${dish.name} by ${req.user.email}`);

    return ApiResponse.success(res, null, 'Dish deleted successfully');
  } catch (error) {
    logger.error('Delete dish error:', error);
    next(error);
  }
};

// ========================================================
// @desc    Toggle availability
// @route   PATCH /api/v1/dishes/:id/availability
// @access  Private (Admin/Manager)
// ========================================================
exports.toggleAvailability = async (req, res, next) => {
  try {
    const dish = await Dish.findById(req.params.id);
    if (!dish) return ApiResponse.notFound(res, 'Dish not found');

    dish.available = !dish.available;

    // Remove user-ID tracking until auth is ready
    // dish.updatedBy = req.user._id;

    await dish.save();

    return ApiResponse.success(
      res,
      { available: dish.available },
      `Dish ${dish.available ? 'enabled' : 'disabled'}`
    );
  } catch (error) {
    next(error);
  }
};


// ========================================================
// @desc    Update status
// @route   PATCH /api/v1/dishes/:id/status
// @access  Private (Admin/Manager)
// ========================================================
exports.updateStatus = async (req, res, next) => {
  try {
    const dish = await Dish.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status, updatedBy: req.user._id },
      { new: true, runValidators: true }
    );

    if (!dish) return ApiResponse.notFound(res, 'Dish not found');

    logger.info(`Dish status updated: ${dish.name}`);

    return ApiResponse.success(res, dish, 'Dish status updated successfully');
  } catch (error) {
    logger.error('Update status error:', error);
    next(error);
  }
};

// ========================================================
// @desc    Dish statistics (Includes category-wise stats)
// @route   GET /api/v1/dishes/stats
// @access  Private (Admin/Manager)
// ========================================================
exports.getDishStats = async (req, res, next) => {
  try {
    const stats = await Dish.aggregate([
      {
        $group: {
          _id: null,
                   
          total: { $sum: 1 },
          available: { $sum: { $cond: ['$available', 1, 0] } },
          unavailable: { $sum: { $cond: [{ $not: ['$available'] }, 1, 0] } },
          vegetarian: { $sum: { $cond: ['$isVegetarian', 1, 0] } },
          vegan: { $sum: { $cond: ['$isVegan', 1, 0] } },
          minPrice: { $min: '$price' },
          maxPrice: { $max: '$price' },
          avgPrice: { $avg: '$price' }
        }
      }
    ]);

    const categoryStats = await Dish.aggregate([
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 }
        }
      },
      {
        $lookup: {
          from: 'categories',
          localField: '_id',
          foreignField: '_id',
          as: 'categoryDetails'
        }
      },
      { $unwind: '$categoryDetails' },
      {
        $project: {
          _id: 0,
          category: '$categoryDetails.name',
          count: 1
        }
      }
    ]);

    return ApiResponse.success(
      res,
      {
        ...stats[0],
        categoryWise: categoryStats
      },
      'Dish statistics retrieved successfully'
    );
  } catch (error) {
    logger.error('Get dish stats error:', error);
    next(error);
  }
};
