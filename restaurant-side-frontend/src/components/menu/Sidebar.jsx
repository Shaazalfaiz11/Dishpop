// import React from 'react';
// import { ChefHat, Plus, BarChart3, Settings, Users } from 'lucide-react';
// import { useNavigate, useLocation } from 'react-router-dom';

// const Sidebar = () => {
//   const navigate = useNavigate();
//   const location = useLocation();

//   const menuItems = [
//     { icon: ChefHat, label: 'Dishes', path: '/dishes' },
//     { icon: Plus, label: 'Add Dish', path: '/dishes/add' },
//     { icon: BarChart3, label: 'Analytics', path: '/analytics' },
//     { icon: Users, label: 'Customers', path: '/customers' },
//     { icon: Settings, label: 'Settings', path: '/settings' }
//   ];

//   return (
//     <aside className="w-64 border-r border-gray-800 min-h-screen p-4 bg-gray-950">
//       <nav className="space-y-2">
//         {menuItems.map((item) => {
//           const Icon = item.icon;
//           const isActive = location.pathname === item.path;
          
//           return (
//             <button
//               key={item.path}
//               onClick={() => navigate(item.path)}
//               className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
//                 isActive
//                   ? 'bg-gray-800 text-white border border-cyan-500/50'
//                   : 'text-gray-400 hover:bg-gray-800 hover:text-white'
//               }`}
//             >
//               <Icon className="w-5 h-5" />
//               <span className="font-medium">{item.label}</span>
//             </button>
//           );
//         })}
//       </nav>
//     </aside>
//   );
// };

// export default Sidebar;