 
// import React, { useEffect, useState } from "react";
// import { api } from "../../services/api";
// import { useNavigate } from "react-router-dom";
// import { toast } from "react-hot-toast";
// import {
//   User, Phone, MapPin, ImageIcon, Save, Building2, UtensilsCrossed
// } from "lucide-react";

// import { Country, State, City } from "country-state-city";

// // STATES + CITIES (You can add more later)
// const statesWithCities = {
//   Bihar: ["Patna", "Gaya", "Bhagalpur", "Muzaffarpur"],
//   UttarPradesh: ["Lucknow", "Kanpur", "Varanasi", "Agra"],
//   Maharashtra: ["Mumbai", "Pune", "Nagpur"],
//   Delhi: ["New Delhi", "Dwarka", "Rohini"],
//   Karnataka: ["Bengaluru", "Mysuru", "Mangalore"],
// };

// export default function EditProfile() {
//   const navigate = useNavigate();

//   const [form, setForm] = useState({
//     restaurantName: "",
//     ownerName: "",
//     phone: "",
//     state: "",
//     city: "",
//     pincode: "",
//     restaurantType: "",
//     description: "",
//   });

//   const [file, setFile] = useState(null);
//   const [preview, setPreview] = useState(null);

//   // Load Profile
//   useEffect(() => {
//     (async () => {
//       try {
//         const { data } = await api.get("/auth/profile");
//         const user = data.user;

//         setForm({
//           restaurantName: user.restaurantName,
//           ownerName: user.ownerName,
//           phone: user.phone,
//           state: user.state,
//           city: user.city,
//           pincode: user.pincode,
//           restaurantType: user.restaurantType || "",
//           description: user.description || "",
//         });

//         if (user.photo) {
//           setPreview(`http://localhost:5001${user.photo}`);
//         }
//       } catch {
//         toast.error("Unable to load profile.");
//         navigate("/login");
//       }
//     })();
//   }, []);

//   const handleChange = (e) => {
//     setForm({ ...form, [e.target.name]: e.target.value });
//   };

//   const handleFileChange = (e) => {
//     const file = e.target.files?.[0];
//     setFile(file);
//     setPreview(URL.createObjectURL(file));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     const fd = new FormData();
//     Object.entries(form).forEach(([key, val]) => fd.append(key, val));
//     if (file) fd.append("profilePhoto", file);

//     try {
//       await api.put("/auth/profile", fd);
//       toast.success("Profile updated successfully!");
//       navigate("/settings");
//     } catch (err) {
//       toast.error("Update failed.");
//     }
//   };

//   return (
//     <div className="min-h-screen bg-[#090B10] text-white px-6 py-14">
//       <div className="max-w-4xl mx-auto space-y-10 animate-fadeIn">

//         <h1 className="text-4xl font-bold tracking-tight">Edit Profile</h1>

//         {/* Card */}
//         <div className="glass-card p-10 rounded-2xl border border-white/10 shadow-lg shadow-cyan-500/10 space-y-10">

//           {/* Profile Photo */}
//           <div className="flex items-center gap-8">
//             <div className="relative">
//               <div className="w-28 h-28 rounded-full overflow-hidden border border-cyan-500/40 shadow-md">
//                 {preview ? (
//                   <img src={preview} className="w-full h-full object-cover" />
//                 ) : (
//                   <div className="w-full h-full bg-gradient-to-r from-blue-600 to-cyan-600 flex items-center justify-center text-4xl font-bold">
//                     {form.ownerName?.[0] || "?"}
//                   </div>
//                 )}
//               </div>

//               {/* Upload button */}
//               <label className="absolute bottom-1 right-1 bg-cyan-600 hover:bg-cyan-700 p-2 rounded-full cursor-pointer transition">
//                 <ImageIcon size={16} />
//                 <input type="file" className="hidden" onChange={handleFileChange} />
//               </label>
//             </div>

//             <div>
//               <p className="text-2xl font-semibold">{form.ownerName}</p>
//               <p className="text-cyan-400">{form.restaurantName}</p>
//             </div>
//           </div>

//           {/* Form */}
//           <form onSubmit={handleSubmit} className="space-y-8">

//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

//               {/* Restaurant Name */}
//               <Field label="Restaurant Name" icon={<Building2 />} name="restaurantName" value={form.restaurantName} onChange={handleChange} />

//               {/* Owner Name */}
//               <Field label="Owner Name" icon={<User />} name="ownerName" value={form.ownerName} onChange={handleChange} />

//               {/* Phone */}
//               <Field label="Phone" icon={<Phone />} name="phone" value={form.phone} onChange={handleChange} />

//               {/* Restaurant Type */}
//               <Field label="Restaurant Type" icon={<UtensilsCrossed />} name="restaurantType" value={form.restaurantType} onChange={handleChange} />

//               {/* STATE DROPDOWN */}
//               <Dropdown
//                 label="State"
//                 name="state"
//                 icon={<MapPin />}
//                 value={form.state}
//                 onChange={(e) => {
//                   setForm({ ...form, state: e.target.value, city: "" });
//                 }}
//                 options={Object.keys(statesWithCities)}
//               />

//               {/* CITY DROPDOWN */}
//               <Dropdown
//                 label="City"
//                 name="city"
//                 icon={<MapPin />}
//                 value={form.city}
//                 onChange={handleChange}
//                 options={form.state ? statesWithCities[form.state] : []}
//                 disabled={!form.state}
//               />

//               {/* PINCODE */}
//               <Field label="Pincode" icon={<MapPin />} name="pincode" value={form.pincode} onChange={handleChange} />
//             </div>

//             {/* Description */}
//             <div className="space-y-2">
//               <label className="text-sm text-gray-400">Description</label>
//               <textarea
//                 name="description"
//                 rows={4}
//                 value={form.description}
//                 onChange={handleChange}
//                 className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:border-cyan-500 transition resize-none"
//               />
//             </div>

//             {/* Buttons */}
//             <div className="flex justify-end">
//               <button
//                 type="submit"
//                 className="flex items-center gap-2 bg-cyan-600 hover:bg-cyan-700 px-6 py-3 rounded-xl font-medium transition shadow shadow-cyan-500/30"
//               >
//                 <Save size={18} /> Save Changes
//               </button>
//             </div>

//           </form>

//         </div>

//       </div>
//     </div>
//   );
// }

// /* Reusable Input Field Component */
// function Field({ label, icon, name, value, onChange }) {
//   return (
//     <div className="space-y-2">
//       <label className="text-sm text-gray-400">{label}</label>
//       <div className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 flex items-center gap-3 focus-within:border-cyan-500">
//         {icon}
//         <input
//           name={name}
//           value={value}
//           onChange={onChange}
//           className="flex-1 bg-transparent outline-none text-white placeholder-gray-500"
//         />
//       </div>
//     </div>
//   );
// }

// /* Dropdown Component */
// function Dropdown({ label, icon, name, value, onChange, options, disabled }) {
//   return (
//     <div className="space-y-2">
//       <label className="text-sm text-gray-400">{label}</label>
//       <div
//         className={`bg-white/5 border border-white/10 rounded-xl px-4 py-3 flex items-center gap-3 ${
//           disabled ? "opacity-40" : "focus-within:border-cyan-500"
//         }`}
//       >
//         {icon}
//         <select
//           name={name}
//           value={value}
//           onChange={onChange}
//           disabled={disabled}
//           className="flex-1 bg-transparent outline-none text-white"
//         >
//           <option value="" className="text-black">Select {label}</option>
//           {options.map((opt) => (
//             <option key={opt} value={opt} className="text-black">
//               {opt}
//             </option>
//           ))}
//         </select>
//       </div>
//     </div>
//   );
// }
import React, { useEffect, useState } from "react";
import { api } from "../../services/api";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

import {
  User,
  Phone,
  MapPin,
  ImageIcon,
  Save,
  Building2,
  UtensilsCrossed
} from "lucide-react";

import { State, City } from "country-state-city";

export default function EditProfile() {
  const navigate = useNavigate();

  /* ---------------------- FORM STATES ---------------------- */
  const [form, setForm] = useState({
    restaurantName: "",
    ownerName: "",
    phone: "",
    state: "",
    city: "",
    pincode: "",
    restaurantType: "",
    description: "",
  });

  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);

  /* ---------------------- STATE + CITY ---------------------- */
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);

  /* ---------------------- LOAD PROFILE ---------------------- */
  useEffect(() => {
    (async () => {
      try {
        const { data } = await api.get("/auth/profile");
        const user = data.user;

        // Load India states
        const indiaStates = State.getStatesOfCountry("IN");
        setStates(indiaStates);

        setForm({
          restaurantName: user.restaurantName,
          ownerName: user.ownerName,
          phone: user.phone,
          state: user.state,
          city: user.city,
          pincode: user.pincode,
          restaurantType: user.restaurantType || "",
          description: user.description || "",
        });

        // Load cities for saved state
        if (user.state) {
          const cityList = City.getCitiesOfState("IN", user.state);
          setCities(cityList);
        }

        if (user.photo) {
          setPreview(`http://localhost:5001${user.photo}`);
        }
      } catch {
        toast.error("Unable to load profile.");
        navigate("/login");
      }
    })();
  }, []);

  /* ---------------------- FORM HANDLERS ---------------------- */
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleStateChange = (e) => {
    const isoCode = e.target.value;

    setForm({ ...form, state: isoCode, city: "" });

    // Load cities for selected state
    const cityList = City.getCitiesOfState("IN", isoCode);
    setCities(cityList);
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    setFile(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const fd = new FormData();
    Object.entries(form).forEach(([key, val]) => fd.append(key, val));
    if (file) fd.append("profilePhoto", file);

    try {
      await api.put("/auth/profile", fd);
      toast.success("Profile updated successfully!");
      navigate("/settings");
    } catch (err) {
      toast.error("Update failed.");
    }
  };

  /* ===========================================================
                     JSX (UI COMPONENTS BELOW)
     =========================================================== */

  return (
    <div className="min-h-screen bg-[#090B10] text-white px-6 py-14">
      <div className="max-w-4xl mx-auto space-y-10">

        <h1 className="text-4xl font-bold tracking-tight">Edit Profile</h1>

        <div className="glass-card p-10 rounded-2xl border border-white/10 shadow-lg shadow-cyan-500/10 space-y-10">

          {/* Profile Photo Section */}
          <div className="flex items-center gap-8">
            <div className="relative">
              <div className="w-28 h-28 rounded-full overflow-hidden border border-cyan-500/40 shadow-md">
                {preview ? (
                  <img src={preview} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-gradient-to-r from-blue-600 to-cyan-600 flex items-center justify-center text-4xl font-bold">
                    {form.ownerName?.[0] || "?"}
                  </div>
                )}
              </div>

              <label className="absolute bottom-1 right-1 bg-cyan-600 hover:bg-cyan-700 p-2 rounded-full cursor-pointer transition">
                <ImageIcon size={16} />
                <input type="file" className="hidden" onChange={handleFileChange} />
              </label>
            </div>

            <div>
              <p className="text-2xl font-semibold">{form.ownerName}</p>
              <p className="text-cyan-400">{form.restaurantName}</p>
            </div>
          </div>

          {/* FORM */}
          <form onSubmit={handleSubmit} className="space-y-8">

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

              <Field label="Restaurant Name" icon={<Building2 />} name="restaurantName" value={form.restaurantName} onChange={handleChange} />

              <Field label="Owner Name" icon={<User />} name="ownerName" value={form.ownerName} onChange={handleChange} />

              <Field label="Phone" icon={<Phone />} name="phone" value={form.phone} onChange={handleChange} />

              <Field label="Restaurant Type" icon={<UtensilsCrossed />} name="restaurantType" value={form.restaurantType} onChange={handleChange} />

              {/* State Dropdown */}
              <Dropdown
                label="State"
                name="state"
                icon={<MapPin />}
                value={form.state}
                onChange={handleStateChange}
                options={states.map((s) => ({ label: s.name, value: s.isoCode }))}
              />

              {/* City Dropdown */}
              <Dropdown
                label="City"
                name="city"
                icon={<MapPin />}
                value={form.city}
                disabled={!form.state}
                onChange={handleChange}
                options={cities.map((c) => ({ label: c.name, value: c.name }))}
              />

              <Field label="Pincode" icon={<MapPin />} name="pincode" value={form.pincode} onChange={handleChange} />
            </div>

            {/* Description */}
            <div className="space-y-2">
              <label className="text-sm text-gray-400">Description</label>
              <textarea
                name="description"
                rows={4}
                value={form.description}
                onChange={handleChange}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:border-cyan-500 transition resize-none"
              />
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                className="flex items-center gap-2 bg-cyan-600 hover:bg-cyan-700 px-6 py-3 rounded-xl font-medium transition shadow shadow-cyan-500/30"
              >
                <Save size={18} />
                Save Changes
              </button>
            </div>

          </form>

        </div>

      </div>
    </div>
  );
}

/* -----------------------------------------------------------
                      REUSABLE COMPONENTS
   ----------------------------------------------------------- */

function Field({ label, icon, name, value, onChange }) {
  return (
    <div className="space-y-2">
      <label className="text-sm text-gray-400">{label}</label>
      <div className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 flex items-center gap-3 focus-within:border-cyan-500">
        {icon}
        <input
          name={name}
          value={value}
          onChange={onChange}
          className="flex-1 bg-transparent outline-none text-white placeholder-gray-500"
        />
      </div>
    </div>
  );
}

function Dropdown({ label, icon, name, value, onChange, options = [], disabled }) {
  return (
    <div className="space-y-2">
      <label className="text-sm text-gray-400">{label}</label>

      <div
        className={`bg-white/5 border border-white/10 rounded-xl px-4 py-3 flex items-center gap-3 ${
          disabled ? "opacity-40" : "focus-within:border-cyan-500"
        }`}
      >
        {icon}

        <select
          name={name}
          value={value}
          onChange={onChange}
          disabled={disabled}
          className="flex-1 bg-transparent outline-none text-white"
        >
          <option value="" className="text-black">Select {label}</option>

          {options.map((opt) => (
            <option key={opt.value} value={opt.value} className="text-black">
              {opt.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
