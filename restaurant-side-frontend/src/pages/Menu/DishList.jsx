import React, { useState } from "react";
import { Plus, Menu, ChefHat, X } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";

import DishCard from "../../components/menu/DishCard.jsx";
import DishFilterBar from "../../components/menu/DishFilterBar.jsx";

import useMenu from "../../hooks/useMenu.js";
import GetQRButton from "../../components/menu/GetQrButton.jsx";
import Sidebar from "../../components/Sidebar.jsx";

const DishList = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const {
    
    dishes,
    filteredDishes,
    categories,
    statuses,
    statistics,
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    selectedStatus,
    setSelectedStatus,
    sortBy,
    setSortBy,
    toggleAvailability,
    deleteDish,
    clearFilters,
  } = useMenu();


  const navigate = useNavigate();
  const { restaurantId } = useParams();
  


  const handleAddNewDish = () => {
  navigate(`/restaurant/${restaurantId}/menu/add`);
};







  const handleEdit = (dish) => {
  navigate(`/restaurant/${restaurantId}/dish/${dish._id}/edit`);
};


  const handleRefresh = () => {
    alert("Refresh feature coming soon");
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="border-b border-gray-800 sticky top-0 bg-black z-50">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="text-gray-400 hover:text-white lg:hidden"
            >
              <Menu className="w-6 h-6" />
            </button>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                <ChefHat className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-xl font-bold text-blue-500">
                ARMenu Manager
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full overflow-hidden flex items-center justify-center">
              <img
                src="https://ui-avatars.com/api/?name=Admin&background=06b6d4&color=fff"
                alt="Profile"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </header>

      <div className="flex relative">
        {/* Sidebar overlay (mobile) */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Sidebar */}
        <div
          className={`
            fixed lg:static inset-y-0 left-0 z-50 transform 
            transition-transform duration-300 ease-in-out
            ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
          `}
        >
          <div className="relative h-full">
            <button
              onClick={() => setSidebarOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white lg:hidden"
            >
              <X className="w-6 h-6" />
            </button>




            <Sidebar/>







          </div>
        </div>

        {/* Main page content */}
        <main className="flex-1 p-4 md:p-8 overflow-x-hidden">
          <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-3xl font-bold">Dish List</h2>

              <button
                onClick={handleAddNewDish}
                className="px-4 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg 
                           flex items-center gap-2 font-semibold transition-all 
                           shadow-lg shadow-blue-500/30"
              >
                <Plus className="w-5 h-5" />
                Add New Dish
              </button>
            </div>

            {/* Statistics */}
            {statistics && (
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <div className="bg-gray-900 p-4 rounded-lg border border-gray-700">
                  <p className="text-gray-400 text-sm">Total Dishes</p>
                  <p className="text-3xl font-bold">{statistics.total}</p>
                </div>

                <div className="bg-gray-900 p-4 rounded-lg border border-gray-700">
                  <p className="text-gray-400 text-sm">Available</p>
                  <p className="text-3xl font-bold text-green-500">
                    {statistics.available}
                  </p>
                </div>

                <div className="bg-gray-900 p-4 rounded-lg border border-gray-700">
                  <p className="text-gray-400 text-sm">Ready</p>
                  <p className="text-3xl font-bold text-blue-500">
                    {statistics.byStatus.ready}
                  </p>
                </div>

                <div className="bg-gray-900 p-4 rounded-lg border border-gray-700">
                  <p className="text-gray-400 text-sm">Processing</p>
                  <p className="text-3xl font-bold text-yellow-500">
                    {statistics.byStatus.processing}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Filters */}
          <DishFilterBar
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            categories={categories}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            statuses={statuses}
            selectedStatus={selectedStatus}
            setSelectedStatus={setSelectedStatus}
            sortBy={sortBy}
            setSortBy={setSortBy}
            clearFilters={clearFilters}
            dishCount={filteredDishes.length}
            totalCount={dishes.length}
          />

          {/* Dish Cards */}
          <div className="space-y-4">
            {filteredDishes.length === 0 ? (
              <div className="text-center py-16 bg-gray-900 rounded-xl border border-gray-800">
                <p className="text-gray-400 text-lg">No dishes found</p>
                <button
                  onClick={clearFilters}
                  className="mt-4 px-6 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg"
                >
                  Clear Filters
                </button>
              </div>
            ) : (
              filteredDishes.map((dish) => (
                <DishCard
                  key={dish._id}
                  dish={dish}
                  onToggleAvailability={toggleAvailability}
                  onEdit={() => handleEdit(dish)}
                  onDelete={() => deleteDish(dish._id)}
                  onRefresh={() => handleRefresh(dish._id)}
                />
              ))
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default DishList;
