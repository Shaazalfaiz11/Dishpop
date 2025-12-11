const sharp = require('sharp');
const { v4: uuidv4 } = require('uuid');
const path = require('path');

const Dish = require('../models/Dish');
const ApiResponse = require('../utils/apiResponse');
const logger = require('../utils/logger');

// NEW CLOUDFLARE R2 UPLOAD FUNCTIONS
const { uploadBuffer, deleteFromR2 } = require('../helpers/storageR2');

const R2_BUCKET = process.env.R2_BUCKET;

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
      sort = 'name',
      page = 1,
      limit = 20
    } = req.query;

    const query = { restaurantId };

    if (category) query.category = category;

    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    if (available !== undefined) {
      query.available = available === "true";
    }

    if (search) {
      query.name = { $regex: search, $options: "i" };
    }

    const sortObj = {};
    if (sort === "priceAsc") sortObj.price = 1;
    if (sort === "priceDesc") sortObj.price = -1;
    if (sort === "nameAsc") sortObj.name = 1;
    if (sort === "nameDesc") sortObj.name = -1;

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
   CREATE DISH  (R2 UPLOAD INCLUDED)
========================================================== */
exports.createDish = async (req, res, next) => {
  try {
    const ownerEmail = req.user.email;
    const restaurantId = req.user.restaurantId;

    if (!ownerEmail || !restaurantId) {
      return ApiResponse.unauthorized(res, 'Invalid restaurant authentication');
    }

    const { name, price, category, description } = req.body;

    if (!name || !price) {
      return ApiResponse.badRequest(res, 'Name and price are required');
    }

    let imageUrl = null;
    let thumbnailUrl = null;

    // File upload
    if (req.file) {
      const ext = path.extname(req.file.originalname) || '.jpg';
      const baseKey = `restaurants/${restaurantId}/dishes/${uuidv4()}`;

      /** Upload original image */
      imageUrl = await uploadBuffer(
        req.file.buffer,
        R2_BUCKET,
        `${baseKey}${ext}`,
        req.file.mimetype
      );

      /** Upload thumbnail */
      const resized = await sharp(req.file.buffer)
        .resize(800, 800, { fit: "inside" })
        .jpeg({ quality: 80 })
        .toBuffer();

      thumbnailUrl = await uploadBuffer(
        resized,
        R2_BUCKET,
        `${baseKey}-thumb.jpg`,
        "image/jpeg"
      );
    }

    const dish = await Dish.create({
      restaurantId,
      restaurantEmail: ownerEmail,
      name,
      description,
      category,
      price: parseFloat(price),
      imageUrl,
      thumbnailUrl
    });

    return ApiResponse.created(res, dish, 'Dish created successfully');
  } catch (err) {
    logger.error("Create dish error:", err);
    next(err);
  }
};


/* ==========================================================
   DELETE DISH
========================================================== */
exports.deleteDish = async (req, res, next) => {
  try {
    const { restaurantId, id } = req.params;

    const dish = await Dish.findOne({ _id: id, restaurantId });
    if (!dish) return ApiResponse.notFound(res, 'Dish not found');

    // If image exists → delete from R2
    if (dish.imageUrl) {
      try {
        const key = dish.imageUrl.split('/').pop(); // Extract key
        await deleteFromR2(R2_BUCKET, key);
      } catch (err) {
        console.log("Cannot delete image from R2:", err.message);
      }
    }

    if (dish.thumbnailUrl) {
      try {
        const key = dish.thumbnailUrl.split('/').pop();
        await deleteFromR2(R2_BUCKET, key);
      } catch (err) {
        console.log("Cannot delete thumbnail from R2:", err.message);
      }
    }

    await dish.deleteOne();

    return ApiResponse.success(res, null, 'Dish deleted successfully');
  } catch (err) {
    logger.error('Delete dish error:', err);
    next(err);
  }
};
