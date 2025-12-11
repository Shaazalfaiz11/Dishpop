import express from "express";
import { adminLogin } from "../AdminControllers/adminAuthController.js";
import { adminAuth } from "../middlewares/adminAuth.js";
import axios from "axios";

const router = express.Router();

// LOGIN
router.post("/login", adminLogin);

// SEARCH RESTAURANT MENU
router.get("/restaurant/:id/menu", adminAuth, async (req, res) => {
  try {
    const url = `${process.env.MAIN_BACKEND_URL}/api/v1/restaurants/${req.params.id}/menu`;
    const response = await axios.get(url, { headers: { Authorization: req.headers.authorization } });

    res.json(response.data);
  } catch (err) {
    res.status(500).json({ success: false, message: "Restaurant not found" });
  }
});

export default router;
