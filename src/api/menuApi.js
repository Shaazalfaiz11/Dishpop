import axiosClient from "./AxiosClient";

const menuApi = {

  // Get full menu for a restaurant
  getMenu(restaurantId) {
    return axiosClient.get(`/restaurants/${restaurantId}/menu`);
  },

  // Create dish (multipart form)
  createDish(restaurantId, formData) {
    return axiosClient.post(
      `/restaurants/${restaurantId}/menu`,
      formData,
      { headers: { "Content-Type": "multipart/form-data" } }
    );
  },

  // Update dish
  updateDish(restaurantId, dishId, formData) {
    return axiosClient.put(
      `/restaurants/${restaurantId}/menu/${dishId}`,
      formData,
      { headers: { "Content-Type": "multipart/form-data" } }
    );
  },

  // Delete dish
  deleteDish(restaurantId, dishId) {
    return axiosClient.delete(
      `/restaurants/${restaurantId}/menu/${dishId}`
    );
  },

  
  toggleAvailability(restaurantId, dishId) {
   return axiosClient.patch(`/dishes/${dishId}/availability`);
  
}


};

export default menuApi;
