import { useEffect, useState } from "react";
import AdminLogin from "./pages/AdminLogin";
import RestaurantList from "./pages/RestaurantList";
import RestaurantMenu from "./pages/RestaurantMenu";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [selectedRestaurantEmail, setSelectedRestaurantEmail] = useState(null);

  // Sync login state with localStorage (supports auto logout)
  useEffect(() => {
    setLoggedIn(Boolean(localStorage.getItem("adminToken")));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    setLoggedIn(false);
    setSelectedRestaurantEmail(null);
  };

  return (
    <>
      {/* GLOBAL TOAST NOTIFICATION SYSTEM */}
      <ToastContainer
        position="top-right"
        autoClose={2500}
        closeOnClick
        pauseOnHover
        theme="dark"
        newestOnTop
      />

      {/* AUTH ROUTING LOGIC */}
      {!loggedIn ? (
        <AdminLogin onLogin={() => setLoggedIn(true)} />
      ) : selectedRestaurantEmail ? (
        <RestaurantMenu
          email={selectedRestaurantEmail}
          onBack={() => setSelectedRestaurantEmail(null)}
          onLogout={handleLogout}
        />
      ) : (
        <RestaurantList
          onSelectRestaurant={setSelectedRestaurantEmail}
          onLogout={handleLogout}
        />
      )}
    </>
  );
}
