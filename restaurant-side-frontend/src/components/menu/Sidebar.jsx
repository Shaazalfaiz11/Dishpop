import { 
  HomeIcon, CubeIcon, ClipboardDocumentListIcon,
  BellIcon, XMarkIcon, Cog6ToothIcon, QrCodeIcon
} from "@heroicons/react/24/outline";
import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function Sidebar() {
  const [open, setOpen] = useState(false);
  const { username } = useParams();

  const { owner } = useAuth(); // logged-in owner

  // 🚀 Correct backend field is owner.ownerName
  const ownerName = owner?.ownerName || "Loading...";

  // Generate initials safely
  const getInitials = (name) => {
    if (!owner) return "…"; // loading state
    return name
      .split(" ")
      .map((n) => n.charAt(0))
      .join("")
      .toUpperCase();
  };

  const initials = getInitials(ownerName);

  useEffect(() => {
    const handleOpenSidebar = () => setOpen(true);
    document.addEventListener("openSidebar", handleOpenSidebar);
    return () => document.removeEventListener("openSidebar", handleOpenSidebar);
  }, []);

  const base = `/${username}`;

  const menuItems = [
    { name: "Dashboard", icon: <HomeIcon className="w-5 h-5" />, path: `${base}/dashboard` },
    { name: "Digital Menu", icon: <CubeIcon className="w-5 h-5" />, path: `${base}/dishes` },
    { name: "Orders", icon: <ClipboardDocumentListIcon className="w-5 h-5" />, path: `${base}/orders` },
    { name: "Get QR", icon: <QrCodeIcon className="w-5 h-5" />, path: `${base}/qr` },
    { name: "Subscribe", icon: <BellIcon className="w-5 h-5" />, path: `${base}/subscribe` },
    { name: "Settings", icon: <Cog6ToothIcon className="w-5 h-5" />, path: `/settings` },
  ];

  return (
    <>
      <div
        className={`fixed inset-0 left-0 w-60 bg-[#11151c]
        p-4 flex flex-col justify-between z-50
        transition-transform duration-300
        ${open ? "translate-x-0" : "-translate-x-full"}
        lg:static lg:translate-x-0 lg:w-60 lg:min-h-screen`}
      >
        {/* Close Button for Mobile */}
        <button
          className="lg:hidden text-white mb-4 self-end"
          onClick={() => setOpen(false)}
        >
          <XMarkIcon className="w-6 h-6" />
        </button>

        {/* Menu Items */}
        <ul className="space-y-4 flex-1">
          {menuItems.map((item, index) => (
            <Link to={item.path} key={index}>
              <li
                className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer 
                hover:bg-[#293042] transition-colors text-white
                ${index === 0 ? "bg-[#3B82F6]" : ""}`}
              >
                {item.icon}
                <span className="text-sm">{item.name}</span>
              </li>
            </Link>
          ))}
        </ul>

        console.log("MENU SIDEBAR LOADED");


        {/* Owner Info */}
        <div className="flex items-center gap-3 p-3 bg-[#293042] rounded-lg mt-6">
          <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-semibold">
            {initials}
          </div>
          <div>
            <p className="text-sm font-medium text-white">{ownerName}</p>
            <p className="text-xs text-gray-400">Restaurant Owner</p>
          </div>
        </div>
      </div>

      {open && (
        <div 
          className="fixed inset-0 bg-black/50 lg:hidden z-40"
          onClick={() => setOpen(false)}
        />
      )}
    </>
  );
}
