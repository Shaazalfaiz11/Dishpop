const sharp = require('sharp');
const { v4: uuidv4 } = require('uuid');
const path = require('path');


const Dish = require('../models/Dish');
const ApiResponse = require('../utils/apiResponse');
const logger = require('../utils/logger');
const { uploadBufferToS3,deleteFromS3  } = require('../helpers/storageS3');

const S3_BUCKET = process.env.S3_BUCKET;

/* ==========================================================
   GET ALL DISHES FOR A RESTAURANT
========================================================== */
exports.getMenu = async (req, res, next) => {
  try {
    const { restaurantId } = req.params;
    const {
      category,
      minPrice,
      maxPrice,
      available,
      search,
      sort = 'name',   // default sort by name
      page = 1,
      limit = 20
    } = req.query;

    

    const query = { restaurantId };

    // Category filter
    if (category) query.category = category;

    // Price filter
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    // Availability filter
    if (available !== undefined) {
      query.available = available === "true";
    }

    // Search filter (name or description)
    if (search) {
      query.name = { $regex: search, $options: "i" };
    }

    // Sorting
    const sortObj = {};
    if (sort === "priceAsc") sortObj.price = 1;
    if (sort === "priceDesc") sortObj.price = -1;
    if (sort === "nameAsc") sortObj.name = 1;
    if (sort === "nameDesc") sortObj.name = -1;

    // Pagination
    const skip = (page - 1) * limit;

    const dishes = await Dish.find(query)
      .sort(sortObj)
      .skip(skip)
      .limit(Number(limit));

    const total = await Dish.countDocuments(query);

    return ApiResponse.success(res, {
      total,
      page: Number(page),
      limit: Number(limit),
      dishes
    }, "Menu retrieved successfully");

 
  } catch (err) {
    logger.error("Get menu filter error:", err);
    next(err);
  }
};


/* ==========================================================
   CREATE DISH (NO AUTH REQUIRED)
========================================================== */
exports.createDish = async (req, res, next) => {
  try {
    const { restaurantId } = req.params;
    const { name, price, category, description } = req.body;

    if (!name || !price) {
      return ApiResponse.badRequest(res, 'Name and price are required');
    }

    let imageUrl = null;
    let thumbnailUrl = null;

    // IMAGE UPLOAD + THUMBNAIL
    if (req.file) {
      const ext = path.extname(req.file.originalname) || '.jpg';
      const baseKey = `restaurants/${restaurantId}/dishes/${uuidv4()}`;

      // Upload original image
      imageUrl = await uploadBufferToS3(
        req.file.buffer,
        S3_BUCKET,
        `${baseKey}${ext}`,
        req.file.mimetype
      );

      // Generate thumbnail
      const resized = await sharp(req.file.buffer)
        .resize(800, 800, { fit: 'inside' })
        .jpeg({ quality: 80 })
        .toBuffer();

      thumbnailUrl = await uploadBufferToS3(
        resized,
        S3_BUCKET,
        `${baseKey}-thumb.jpg`,
        'image/jpeg'
      );
    }

    const dish = await Dish.create({
      restaurantId,
      name,
      description,
      category,
      price: parseFloat(price),
      imageUrl,
      thumbnailUrl,
    });

    return ApiResponse.created(res, dish, 'Dish created successfully');
  } catch (err) {
    logger.error('Create dish error:', err);
    next(err);
  }
};

/* ==========================================================
  
========================================================== */

/* ==========================================================
   DELETE DISH
========================================================== */
exports.deleteDish = async (req, res, next) => {
  try {
    const { restaurantId, id } = req.params;

    const dish = await Dish.findOne({ _id: id, restaurantId });
    if (!dish) return ApiResponse.notFound(res, 'Dish not found');

    await dish.deleteOne();

    return ApiResponse.success(res, null, 'Dish deleted successfully');
  } catch (err) {
    logger.error('Delete dish error:', err);
    next(err);
  }
};
