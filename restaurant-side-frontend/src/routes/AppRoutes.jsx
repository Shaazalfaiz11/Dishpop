// // import { Routes, Route } from "react-router-dom";
// // import ProtectedRoute from "../components/ProtectedRoute";

// // // AUTH
// // import Register from "../pages/auth/Register";
// // import Login from "../pages/auth/Login";
// // import Forget from "../pages/auth/Forget";
// // import ResetPassword from "../pages/auth/ResetPassword";

// // // PROFILE
// // import Profile from "../pages/profile/Profile";
// // import EditProfile from "../pages/profile/EditProfile";

// // // OWNER + MENU
// // import Dashboard from "../pages/Dashboard/OwnerDashboard";
// // import SubscriptionPage from "../pages/subscription/subscriptionPage";
// // import DishList from "../pages/Menu/DishList";
// // import AddDishPage from "../pages/Menu/AddDishPage";
// // import EditDishPage from "../pages/Menu/EditDishPage";
// // import QrPage from "../pages/Menu/QrPage";
// // import OrdersPage from "../pages/ordermanage/OrderPage";

// // // CUSTOMER
// // import LandingPage from "../pages/Home/LandingPage";

// // export default function AppRoutes() {
// //   return (
// //     <Routes>

// //       {/* PUBLIC */}
// //       <Route path="/" element={<LandingPage />} />

// //       {/* AUTH */}
// //       <Route path="/register" element={<Register />} />
// //       <Route path="/login" element={<Login />} />
// //       <Route path="/forget" element={<Forget />} />
// //       <Route path="/reset-password" element={<ResetPassword />} />

// //       {/* PROTECTED ROUTES */}
// //       <Route
// //         path="/profile"
// //         element={
// //           <ProtectedRoute>
// //             <Profile />
// //           </ProtectedRoute>
// //         }
// //       />

// //       <Route
// //         path="/edit-profile"
// //         element={
// //           <ProtectedRoute>
// //             <EditProfile />
// //           </ProtectedRoute>
// //         }
// //       />

// //       <Route
// //         path="/dashboard/:restaurantId"
// //         element={
// //           <ProtectedRoute>
// //             <Dashboard />
// //           </ProtectedRoute>
// //         }
// //       />

// //       <Route
// //         path="/subscribe/:restaurantId"
// //         element={
// //           <ProtectedRoute>
// //             <SubscriptionPage />
// //           </ProtectedRoute>
// //         }
// //       />

// //       <Route
// //         path="/restaurant/:restaurantId/dishes"
// //         element={
// //           <ProtectedRoute>
// //             <DishList />
// //           </ProtectedRoute>
// //         }
// //       />

// //       <Route
// //         path="/restaurant/:restaurantId/menu/add"
// //         element={
// //           <ProtectedRoute>
// //             <AddDishPage />
// //           </ProtectedRoute>
// //         }
// //       />

// //       <Route
// //         path="/restaurant/:restaurantId/dish/:id/edit"
// //         element={
// //           <ProtectedRoute>
// //             <EditDishPage />
// //           </ProtectedRoute>
// //         }
// //       />

// //       <Route
// //         path="/qr/:restaurantId"
// //         element={
// //           <ProtectedRoute>
// //             <QrPage />
// //           </ProtectedRoute>
// //         }
// //       />

// //       <Route
// //         path="/restaurant/:restaurantId/orders"
// //         element={
// //           <ProtectedRoute>
// //             <OrdersPage />
// //           </ProtectedRoute>
// //         }
// //       />

// //     </Routes>
// //   );
// // }
// // src/routes/AppRoutes.jsx
// import { Routes, Route } from "react-router-dom";
// import ProtectedRoute from "../components/ProtectedRoute";

// // AUTH PAGES
// import Register from "../pages/auth/Register";
// import Login from "../pages/auth/Login";
// import Forget from "../pages/auth/Forget";
// import ResetPassword from "../pages/auth/ResetPassword";

// // PROFILE
// import Profile from "../pages/profile/Profile";
// import EditProfile from "../pages/profile/EditProfile";

// // OWNER + MENU
// import Dashboard from "../pages/Dashboard/OwnerDashboard";
// import SubscriptionPage from "../pages/subscription/subscriptionPage";
// import DishList from "../pages/Menu/DishList";
// import AddDishPage from "../pages/Menu/AddDishPage";
// import EditDishPage from "../pages/Menu/EditDishPage";
// import QrPage from "../pages/Menu/QrPage";
// import OrdersPage from "../pages/ordermanage/OrderPage";

// // CUSTOMER
// import LandingPage from "../pages/Home/LandingPage";

// // 404 PAGE
// import NotFound from "../pages/NotFound/NotFound";

// export default function AppRoutes() {
//   return (
//     <Routes>

//       {/* PUBLIC ROUTES */}
//       <Route path="/" element={<LandingPage />} />
//       <Route path="/register" element={<Register />} />
//       <Route path="/login" element={<Login />} />
//       <Route path="/forget" element={<Forget />} />
//       <Route path="/reset-password" element={<ResetPassword />} />

//       {/* PROTECTED ROUTES */}
//       <Route
//         path="/profile"
//         element={
//           <ProtectedRoute>
//             <Profile />
//           </ProtectedRoute>
//         }
//       />
//       <Route
//         path="/edit-profile"
//         element={
//           <ProtectedRoute>
//             <EditProfile />
//           </ProtectedRoute>
//         }
//       />

//       <Route
//         path="/dashboard/:restaurantId"
//         element={
//           <ProtectedRoute checkId={true}>
//             <Dashboard />
//           </ProtectedRoute>
//         }
//       />
//       <Route
//         path="/subscribe/:restaurantId"
//         element={
//           <ProtectedRoute checkId={true}>
//             <SubscriptionPage />
//           </ProtectedRoute>
//         }
//       />
//       <Route
//         path="/restaurant/:restaurantId/dishes"
//         element={
//           <ProtectedRoute checkId={true}>
//             <DishList />
//           </ProtectedRoute>
//         }
//       />
//       <Route
//         path="/restaurant/:restaurantId/menu/add"
//         element={
//           <ProtectedRoute checkId={true}>
//             <AddDishPage />
//           </ProtectedRoute>
//         }
//       />
//       <Route
//         path="/restaurant/:restaurantId/dish/:id/edit"
//         element={
//           <ProtectedRoute checkId={true}>
//             <EditDishPage />
//           </ProtectedRoute>
//         }
//       />
//       <Route
//         path="/qr/:restaurantId"
//         element={
//           <ProtectedRoute checkId={true}>
//             <QrPage />
//           </ProtectedRoute>
//         }
//       />
//       <Route
//         path="/restaurant/:restaurantId/orders"
//         element={
//           <ProtectedRoute checkId={true}>
//             <OrdersPage />
//           </ProtectedRoute>
//         }
//       />

//       {/* CATCH-ALL 404 ROUTE */}
//       <Route path="*" element={<NotFound />} />

//     </Routes>
//   );
// }
// src/routes/AppRoutes.jsx
import { Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "../components/ProtectedRoute";

// AUTH
import Register from "../pages/auth/Register";
import Login from "../pages/auth/Login";
import Forget from "../pages/auth/Forget";
import ResetPassword from "../pages/auth/ResetPassword";

// PROFILE
import Profile from "../pages/profile/Profile";
import EditProfile from "../pages/profile/EditProfile";

// OWNER + MENU
import Dashboard from "../pages/Dashboard/OwnerDashboard";
import SubscriptionPage from "../pages/subscription/subscriptionPage";
import DishList from "../pages/Menu/DishList";
import AddDishPage from "../pages/Menu/AddDishPage";
import EditDishPage from "../pages/Menu/EditDishPage";
import QrPage from "../pages/Menu/QrPage";
import OrdersPage from "../pages/ordermanage/OrderPage";

// CUSTOMER
import LandingPage from "../pages/Home/LandingPage";

// 404
import NotFound from "../pages/NotFound/NotFound";

export default function AppRoutes() {
  return (
    <Routes>
      {/* PUBLIC ROUTES */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />
      <Route path="/forget" element={<Forget />} />
      <Route path="/reset-password" element={<ResetPassword />} />

      {/* PROTECTED ROUTES */}
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        }
      />
      <Route
        path="/edit-profile"
        element={
          <ProtectedRoute>
            <EditProfile />
          </ProtectedRoute>
        }
      />

      <Route
        path="/dashboard/:restaurantId"
        element={
          <ProtectedRoute validateResource={true}>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/subscribe/:restaurantId"
        element={
          <ProtectedRoute validateResource={true}>
            <SubscriptionPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/restaurant/:restaurantId/dishes"
        element={
          <ProtectedRoute validateResource={true}>
            <DishList />
          </ProtectedRoute>
        }
      />
      <Route
        path="/restaurant/:restaurantId/menu/add"
        element={
          <ProtectedRoute validateResource={true}>
            <AddDishPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/restaurant/:restaurantId/dish/:id/edit"
        element={
          <ProtectedRoute validateResource={true}>
            <EditDishPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/qr/:restaurantId"
        element={
          <ProtectedRoute validateResource={true}>
            <QrPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/restaurant/:restaurantId/orders"
        element={
          <ProtectedRoute validateResource={true}>
            <OrdersPage />
          </ProtectedRoute>
        }
      />

      {/* CATCH-ALL 404 */}
      <Route path="/404" element={<NotFound />} />
      <Route path="*" element={<Navigate to="/404" replace />} />
    </Routes>
  );
}
