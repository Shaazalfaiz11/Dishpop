const mongoose = require('mongoose');

const DishSchema = new mongoose.Schema({
  restaurantId: { type: String, required: true },
  restaurantEmail: { type: String, required: true },


  name: { type: String, required: true },
  description: { type: String },
  category: { type: String },
  price: { type: Number, required: true },

  imageUrl: { type: String },
  thumbnailUrl: { type: String },

  available: { type: Boolean, default: true },

  createdBy: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "User",
  default: null
},
updatedBy: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "User",
  default: null
},

});

module.exports = mongoose.model('Dish', DishSchema);
