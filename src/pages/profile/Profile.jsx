import React, { useEffect, useState } from "react";
import { api } from "../../services/api";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import {
  User, Mail, Phone, MapPin, Edit3, LogOut, Building2,
  Award, Star, UtensilsCrossed
} from "lucide-react";

export default function Profile() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      try {
        const { data } = await api.get("/auth/profile");
        setUser(data.user);
      } catch {
        toast.error("Session expired.");
        navigate("/login");
      }
    })();
  }, []);

  const logout = async () => {
    await api.post("/auth/logout");
    localStorage.removeItem("token");
    navigate("/login");
  };

  if (!user)
    return (
      <div className="h-screen flex items-center justify-center text-white">
        Loading...
      </div>
    );

  return (
    <div className="min-h-screen bg-[#090B10] text-white px-6 py-10">
      <div className="max-w-4xl mx-auto space-y-10 animate-fadeInUp">

        {/* Header */}
        <div className="flex items-center gap-6">
          <ProfileImage user={user} />

          <div>
            <h1 className="text-4xl font-bold tracking-tight">{user.ownerName}</h1>
            <p className="text-cyan-400 text-lg font-medium mt-1">
              {user.restaurantName}
            </p>

            <div className="flex gap-3 mt-3">
              <Tag icon={<MapPin />} text={`${user.city}, ${user.state}`} />
              <Tag icon={<Award />} text="Verified Owner" />
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Stat icon={<UtensilsCrossed />} label="Dishes" value="47" />
          <Stat icon={<Star />} label="Rating" value="4.8" />
          <Stat icon={<Award />} label="Subscription" value="Pro" />
          <Stat icon={<User />} label="Member" value="Since 2024" />
        </div>

        {/* Info Card */}
        <div className="glass-card p-8 space-y-6">
          <Section title="Contact">
            <Info icon={<Mail />} value={user.email} />
            <Info icon={<Phone />} value={user.phone} />
          </Section>

          <Section title="Business Details">
            <Info icon={<Building2 />} value={user.restaurantName} />
            <Info icon={<MapPin />} value={`${user.city}, ${user.state}`} />
            {user.pincode && <Info value={`Pincode: ${user.pincode}`} />}
          </Section>

          {user.description && (
            <Section title="About Restaurant">
              <p className="text-gray-300 text-sm leading-relaxed">
                {user.description}
              </p>
            </Section>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-4">
          <Button
            text="Edit Profile"
            icon={<Edit3 className="w-4 h-4" />}
            onClick={() => navigate("/settings/edit")}

            type="primary"
          />
          <Button
            text="Logout"
            icon={<LogOut className="w-4 h-4" />}
            onClick={logout}
            type="danger"
          />
        </div>
      </div>
    </div>
  );
}

/* small UI components below */

function ProfileImage({ user }) {
  if (user.photo)
    return (
      <img
        src={`http://localhost:5001${user.photo}`}
        className="w-28 h-28 rounded-full object-cover
        shadow-[0_0_25px_rgba(14,165,233,0.25)] border border-[#0EA5E9]"
      />
    );

  return (
    <div className="w-28 h-28 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600
    flex items-center justify-center text-4xl font-bold shadow-lg">
      {user.ownerName?.[0]}
    </div>
  );
}

function Tag({ icon, text }) {
  return (
    <div className="flex items-center gap-1.5 text-xs px-3 py-1.5
    bg-white/5 border border-white/10 rounded-full text-gray-300">
      <span className="text-cyan-400">{icon}</span>
      {text}
    </div>
  );
}

function Stat({ icon, label, value }) {
  return (
    <div className="glass-card text-center py-6">
      <div className="flex justify-center mb-2 text-cyan-400">{icon}</div>
      <p className="text-2xl font-bold">{value}</p>
      <p className="text-gray-400 text-sm mt-1">{label}</p>
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div className="space-y-2">
      <h3 className="text-lg font-semibold">{title}</h3>
      <div className="space-y-3">{children}</div>
    </div>
  );
}

function Info({ icon, value }) {
  return (
    <div className="flex items-center gap-3">
      {icon && <span className="text-cyan-400">{icon}</span>}
      <p className="text-gray-300 text-sm font-medium">{value}</p>
    </div>
  );
}

function Button({ text, icon, onClick, type }) {
  const base =
    "flex items-center gap-2 px-6 py-3 rounded-xl font-medium text-sm transition-all duration-300 hover:-translate-y-0.5";
  const types = {
    primary: "bg-cyan-600 hover:bg-cyan-700 shadow shadow-cyan-500/30",
    danger: "bg-red-600 hover:bg-red-700 shadow shadow-red-500/30",
  };

  return (
    <button onClick={onClick} className={`${base} ${types[type]}`}>
      {icon} {text}
    </button>
  );
}
