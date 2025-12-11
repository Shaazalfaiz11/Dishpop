// admin-backend/routes/dish.routes.js
import express from "express";
import multer from "multer";
import { adminAuth } from "../middlewares/adminAuth.js";
import Dish from "../models/dish.js";

// R2 Upload Helpers
import {
  uploadBufferToR2,
  deleteFromR2,
} from "../utils/r2Upload.js";

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

/* ============================================================
   1️⃣ UPDATE DISH DETAILS
   PATCH /api/admin/dish/:dishId
============================================================ */
router.patch("/dish/:dishId", adminAuth, async (req, res) => {
  try {
    const { dishId } = req.params;

    const dish = await Dish.findByIdAndUpdate(dishId, req.body, {
      new: true,
    });

    if (!dish) {
      return res.status(404).json({
        success: false,
        message: "Dish not found",
      });
    }

    return res.json({
      success: true,
      message: "Dish updated successfully",
      dish,
    });
  } catch (err) {
    console.error("Dish update error:", err);
    return res.status(500).json({
      success: false,
      message: "Failed to update dish",
    });
  }
});

/* ============================================================
   2️⃣ UPLOAD or REPLACE GLB (Android/Web AR)
   POST /api/admin/dish/:dishId/upload-glb
============================================================ */
router.post(
  "/dish/:dishId/upload-glb",
  adminAuth,
  upload.single("model"),
  async (req, res) => {
    try {
      const { dishId } = req.params;

      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: "No GLB file uploaded",
        });
      }

      const dish = await Dish.findById(dishId);
      if (!dish) {
        return res.status(404).json({
          success: false,
          message: "Dish not found",
        });
      }

      // Delete old GLB model if exists
      if (dish.arModelUrl) {
        const oldKey = dish.arModelUrl.split("/").slice(3).join("/");
        deleteFromR2(oldKey).catch(() => {});
      }

      // Upload new GLB
      const fileKey = `dishes/${dishId}/${Date.now()}.glb`;
      const fileUrl = await uploadBufferToR2(
        req.file.buffer,
        fileKey,
        "model/gltf-binary"
      );

      dish.arModelUrl = fileUrl;
      await dish.save();

      return res.json({
        success: true,
        message: "GLB model uploaded successfully",
        url: fileUrl,
      });
    } catch (err) {
      console.error("GLB upload error:", err);
      return res.status(500).json({
        success: false,
        message: "Failed to upload GLB file",
      });
    }
  }
);

/* ============================================================
   3️⃣ UPLOAD or REPLACE USDZ (iOS AR)
   POST /api/admin/dish/:dishId/upload-ios
============================================================ */
router.post(
  "/dish/:dishId/upload-ios",
  adminAuth,
  upload.single("iosModel"),
  async (req, res) => {
    try {
      const { dishId } = req.params;

      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: "No iOS model file uploaded",
        });
      }

      const dish = await Dish.findById(dishId);
      if (!dish) {
        return res.status(404).json({
          success: false,
          message: "Dish not found",
        });
      }

      // Delete old USDZ model
      if (dish.iosModelUrl) {
        const oldKey = dish.iosModelUrl.split("/").slice(3).join("/");
        deleteFromR2(oldKey).catch(() => {});
      }

      // Upload new USDZ
      const fileKey = `dishes/${dishId}/ios-${Date.now()}.usdz`;
      const fileUrl = await uploadBufferToR2(
        req.file.buffer,
        fileKey,
        "model/vnd.usdz+zip"
      );

      dish.iosModelUrl = fileUrl;
      await dish.save();

      return res.json({
        success: true,
        message: "iOS model uploaded successfully",
        url: fileUrl,
      });
    } catch (err) {
      console.error("iOS model upload error:", err);
      return res.status(500).json({
        success: false,
        message: "Failed to upload iOS model",
      });
    }
  }
);

/* ============================================================
   4️⃣ DELETE DISH
   DELETE /api/admin/dish/:dishId
============================================================ */
router.delete("/dish/:dishId", adminAuth, async (req, res) => {
  try {
    const { dishId } = req.params;

    const dish = await Dish.findById(dishId);
    if (!dish) {
      return res.status(404).json({
        success: false,
        message: "Dish not found",
      });
    }

    // Delete GLB file if exists
    if (dish.arModelUrl) {
      const key = dish.arModelUrl.split("/").slice(3).join("/");
      deleteFromR2(key).catch(() => {});
    }

    // Delete USDZ file if exists
    if (dish.iosModelUrl) {
      const key = dish.iosModelUrl.split("/").slice(3).join("/");
      deleteFromR2(key).catch(() => {});
    }

    await dish.deleteOne();

    return res.json({
      success: true,
      message: "Dish deleted successfully",
    });
  } catch (err) {
    console.error("Dish delete error:", err);
    return res.status(500).json({
      success: false,
      message: "Failed to delete dish",
    });
  }
});

export default router;
