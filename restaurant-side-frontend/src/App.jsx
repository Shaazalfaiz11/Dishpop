// // import React from "react";

// // import AppRoutes from "./routes/AppRoutes";

// // function App() {
// //   return (
// //     <>
// //       <AppRoutes/>
// //     </>
// //   );
// // }


// // export default App;
// import React from "react";

// import AppRoutes from "./routes/AppRoutes";
// import { useAuth } from "../context/AuthContext";

// function App() {
//   return (
//     <>
//       {/* Wrap the whole application with AuthProvider */}
//       <AuthProvider>
//         <AppRoutes />
//       </AuthProvider>
//     </>
//   );
// }

// export default App;
import React from "react";

import AppRoutes from "./routes/AppRoutes";
import { AuthProvider } from "./context/AuthContext";  // ✅ correct path

function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
}

export default App;
