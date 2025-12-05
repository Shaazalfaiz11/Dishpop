// import React, { useEffect, useState } from "react";
// import { api } from "../../services/api";

// const EditProfile = () => {
//   const [form, setForm] = useState({
//     restaurantName: "",
//     ownerName: "",
//     phone: "",
//     state: "",
//     city: "",
//     pincode: "",
//     type: "",
//     category: "",
//     restaurantDescription: "",
//   });
//   const [file, setFile] = useState(null);

//   useEffect(() => {
//     const fetchProfile = async () => {
//       try {
//         const { data } = await api.get("/profile/me");
//         setForm(data); // prefill form safely
//       } catch (err) {
//         console.error(err);
//       }
//     };

//     fetchProfile();
//   }, []);

//   const handleChange = (e) => {
//     setForm({ ...form, [e.target.name]: e.target.value });
//   };

//   const handleFileChange = (e) => {
//     setFile(e.target.files[0]);
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     const formData = new FormData();
//     Object.keys(form).forEach((key) => formData.append(key, form[key]));
//     if (file) formData.append("profilePhoto", file);

//     try {
//       await api.put("/profile/update", formData, {
//         headers: { "Content-Type": "multipart/form-data" },
//       });
//       alert("Profile updated successfully!");
//       window.location.href = "/profile"; // redirect to profile page
//     } catch (err) {
//       console.error(err);
//       alert("Update failed");
//     }
//   };

//   return (
//     <div className="max-w-3xl mx-auto p-6 bg-white shadow-md rounded-md mt-10">
//       <h1 className="text-2xl font-bold mb-6">Edit Profile</h1>
//       <form onSubmit={handleSubmit} className="space-y-4">
//         {[
//           { name: "restaurantName", label: "Restaurant Name" },
//           { name: "ownerName", label: "Owner Name" },
//           { name: "phone", label: "Phone" },
//           { name: "state", label: "State" },
//           { name: "city", label: "City" },
//           { name: "pincode", label: "Pincode" },
//           { name: "type", label: "Type" },
//           { name: "category", label: "Category" },
//           { name: "restaurantDescription", label: "Description" },
//         ].map((field) => (
//           <div key={field.name}>
//             <label className="block mb-1 font-medium">{field.label}</label>
//             <input
//               type="text"
//               name={field.name}
//               value={form[field.name] || ""}
//               onChange={handleChange}
//               className="w-full px-3 py-2 border rounded-md"
//             />
//           </div>
//         ))}

//         <div>
//           <label className="block mb-1 font-medium">Profile Photo</label>
//           <input type="file" onChange={handleFileChange} />
//         </div>

//         <button
//           type="submit"
//           className="mt-4 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
//         >
//           Save Changes
//         </button>
//       </form>
//     </div>
//   );
// };

// export default EditProfile;
import React, { useEffect, useState } from "react";
import { api } from "../../services/api";

const EditProfile = () => {
  const [form, setForm] = useState({
    restaurantName: "",
    ownerName: "",
    phone: "",
    state: "",
    city: "",
    pincode: "",
    type: "",
    category: "",
    restaurantDescription: "",
  });
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data } = await api.get("/profile/me");
        setForm(data);
        if (data.profilePhoto) setPreview(`http://localhost:5000${data.profilePhoto}`);
      } catch (err) {
        console.error(err);
      }
    };
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFile(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    Object.keys(form).forEach((key) => formData.append(key, form[key]));
    if (file) formData.append("profilePhoto", file);

    try {
      await api.put("/profile/update", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("Profile updated successfully!");
      window.location.href = "/profile";
    } catch (err) {
      console.error(err);
      alert("Update failed");
    }
  };

  return (
    <div className="max-w-4xl mx-auto mt-12 p-8 bg-white shadow-lg rounded-xl border border-gray-200">
      <h1 className="text-3xl font-extrabold text-gray-800 mb-8 text-center">
        Edit Profile
      </h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            { name: "restaurantName", label: "Restaurant Name" },
            { name: "ownerName", label: "Owner Name" },
            { name: "phone", label: "Phone" },
            { name: "state", label: "State" },
            { name: "city", label: "City" },
            { name: "pincode", label: "Pincode" },
            { name: "type", label: "Type" },
            { name: "category", label: "Category" },
          ].map((field) => (
            <div key={field.name}>
              <label className="block mb-2 text-gray-700 font-semibold">
                {field.label}
              </label>
              <input
                type="text"
                name={field.name}
                value={form[field.name] || ""}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 transition duration-200"
              />
            </div>
          ))}

          <div className="md:col-span-2">
            <label className="block mb-2 text-gray-700 font-semibold">
              Restaurant Description
            </label>
            <textarea
              name="restaurantDescription"
              value={form.restaurantDescription || ""}
              onChange={handleChange}
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 transition duration-200 resize-none"
              placeholder="Describe your restaurant..."
            />
          </div>
        </div>

        <div className="md:col-span-2">
          <label className="block mb-2 text-gray-700 font-semibold">Profile Photo</label>
          <div className="flex items-center gap-4">
            <label className="cursor-pointer bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition duration-200">
              Upload Photo
              <input type="file" onChange={handleFileChange} className="hidden" />
            </label>
            {preview && (
              <img
                src={preview}
                alt="Profile Preview"
                className="w-20 h-20 object-cover rounded-full border border-gray-300"
              />
            )}
          </div>
        </div>

        <div className="text-center">
          <button
            type="submit"
            className="px-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition duration-200"
          >
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditProfile;
