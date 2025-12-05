import axios from "axios";

const API = "http://localhost:5001/api/v1";

export const getRestaurantOrders = async (restaurantId) => {
  return axios.get(`${API}/restaurants/${restaurantId}/orders`);
};

export const updateOrderStatus = async (orderId, status) => {
  return axios.patch(`${API}/orders/${orderId}/status`, { status });
};
