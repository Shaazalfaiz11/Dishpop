import { useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import { 
  User, Mail, Phone, MapPin, Lock, Building2, ChefHat 
} from "lucide-react";

export default function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    restaurantName: "",
    ownerName: "",
    email: "",
    phone: "",
    state: "",
    city: "",
    pincode: "",
    type: "",
    category: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({ ...prev, [name]: value }));

    // clear previous error on typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    // Frontend validation
    const newErrors = {};

    for (const [key, value] of Object.entries(formData)) {
      if (!value) newErrors[key] = "This field is required";
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      setLoading(true);

      const { data } = await axios.post(
        "http://localhost:5001/api/auth/register",
        formData,
        { withCredentials: true }
      );

      toast.success(data.message || "Registered Successfully!");

      navigate("/login");
    } catch (err) {
      const backendErrors = err.response?.data?.errors;
      const message = err.response?.data?.message || "Registration Failed";

      if (backendErrors) setErrors(backendErrors);

      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0C0F14] text-white flex items-center justify-center p-4">
      <div className="w-full max-w-xl bg-white/5 border border-white/10 p-8 rounded-2xl shadow-xl">
        <h1 className="text-3xl font-semibold text-center mb-6">Register</h1>

        <form className="space-y-5" onSubmit={handleRegister}>
          {inputs.map((input, idx) => (
            <FormField
              key={idx}
              input={input}
              value={formData[input.name]}
              error={errors[input.name]}
              onChange={handleChange}
            />
          ))}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 rounded-xl text-lg font-medium transition disabled:opacity-50"
          >
            {loading ? "Registering..." : "Register"}
          </button>

          <p className="text-center text-gray-300 mt-2">
            Already have an account?{" "}
            <Link to="/login" className="text-blue-400 underline">
              Login
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}

/* --------------------- INPUT CONFIG ------------------------- */
const inputs = [
  { label: "Restaurant Name", name: "restaurantName", icon: <Building2 />, type: "text" },
  { label: "Owner Name", name: "ownerName", icon: <User />, type: "text" },
  { label: "Email", name: "email", icon: <Mail />, type: "email" },
  { label: "Phone", name: "phone", icon: <Phone />, type: "text" },

  { label: "State", name: "state", icon: <MapPin />, type: "select",
    options: ["Bihar", "UP", "Delhi", "Mumbai"] 
  },

  { label: "City", name: "city", icon: <MapPin />, type: "select",
    options: ["Patna", "Gaya", "Noida", "Delhi"] 
  },

  { label: "Pincode", name: "pincode", icon: <MapPin />, type: "text" },

  { label: "Type", name: "type", icon: <Building2 />, type: "select",
    options: ["Restaurant", "Cafe", "Bakery"] 
  },

  { label: "Category", name: "category", icon: <ChefHat />, type: "select",
    options: ["Veg", "Non-Veg", "Cake"] 
  },

  { label: "Password", name: "password", icon: <Lock />, type: "password" },
  { label: "Confirm Password", name: "confirmPassword", icon: <Lock />, type: "password" },
];

/* --------------------- REUSABLE FORM FIELD ------------------------- */
function FormField({ input, value, onChange, error }) {
  const { label, name, type, icon, options } = input;

  if (type === "select") {
    return (
      <div>
        <label className="text-sm text-gray-300">{label}</label>
        <div
          className={`flex items-center gap-3 bg-white/10 border px-4 py-3 rounded-xl ${
            error ? "border-red-500" : "border-white/20"
          }`}
        >
          <span className="text-gray-400">{icon}</span>

          <select
            name={name}
            value={value}
            onChange={onChange}
            className="w-full bg-transparent outline-none text-white"
          >
            <option value="">Select {label}</option>
            {options.map((opt, idx) => (
              <option key={idx} value={opt} className="text-black">
                {opt}
              </option>
            ))}
          </select>
        </div>

        {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
      </div>
    );
  }

  return (
    <div>
      <label className="text-sm text-gray-300">{label}</label>

      <div
        className={`flex items-center gap-3 bg-white/10 border px-4 py-3 rounded-xl ${
          error ? "border-red-500" : "border-white/20"
        }`}
      >
        <span className="text-gray-400">{icon}</span>

        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          className="w-full bg-transparent text-white outline-none"
        />
      </div>

      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
}
