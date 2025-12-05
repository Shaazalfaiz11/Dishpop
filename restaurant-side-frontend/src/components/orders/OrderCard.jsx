import React, { memo } from "react";

// ---------------------------------------------
// THEME CONSTANTS
// ---------------------------------------------
const COLORS = {
  cardBg: "#1A1F25",
  textPrimary: "#E6E9EF",
  textMuted: "#9AA0A6",
  border: "#2A313B",
  blue: "#3D8BFF",
  success: "#4CCB5A",
  warning: "#FF8B1F",
  danger: "#FF4C4C",
};

// Status → Color Map
const STATUS_COLORS = {
  pending: COLORS.warning,
  preparing: COLORS.blue,
  ready: COLORS.success,
  completed: COLORS.textMuted,
};

// Status → Next Action Map
const NEXT_STATUS = {
  pending: { label: "Start Preparing", to: "preparing" },
  preparing: { label: "Mark Ready", to: "ready" },
  ready: { label: "Complete Order", to: "completed" },
};

// Format time
const formatTime = (dateString) => {
  const d = new Date(dateString);
  return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
};

// ---------------------------------------------
// ORDER CARD COMPONENT
// ---------------------------------------------
const OrderCard = ({ order, onUpdate }) => {
  const action = NEXT_STATUS[order.status];
  const color = STATUS_COLORS[order.status];

  return (
    <div
      className="p-4 rounded-xl shadow-md mb-4 transition-all duration-200"
      style={{
        background: COLORS.cardBg,
        border: `1px solid ${COLORS.border}`,
      }}
    >
      {/* Header */}
      <div className="flex justify-between items-center mb-2">
        <div>
          <div className="text-lg font-semibold" style={{ color: COLORS.textPrimary }}>
            Order #{order._id.slice(-5)}
          </div>

          {/* Customer Info */}
          <div className="text-xs mt-1" style={{ color: COLORS.textMuted }}>
            {order.customerName} • {order.phoneNumber}
          </div>

          {/* Order Time & Table */}
          <div className="text-xs" style={{ color: COLORS.textMuted }}>
            {formatTime(order.createdAt)} 
            {order.tableNumber ? ` | Table: ${order.tableNumber}` : ""}
          </div>
        </div>

        <span
          className="px-2 py-1 rounded-md text-xs font-medium"
          style={{
            background: `${color}22`,
            color,
            border: `1px solid ${color}44`,
          }}
        >
          {order.status.toUpperCase()}
        </span>
      </div>

      {/* Items */}
      <div className="space-y-1 text-sm mt-3">
        {order.items.map((item, index) => (
          <div
            key={item._id || `${item.itemId}-${index}`}
            className="flex justify-between items-center"
            style={{ color: COLORS.textMuted }}
          >
            <span>
              {item.qty} × {item.name}
            </span>

            <span>₹{item.price}</span>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="flex justify-between items-center mt-4">
        <div className="font-bold text-base" style={{ color: COLORS.textPrimary }}>
          Total: ₹
          {order.items.reduce((sum, i) => sum + (i.price * i.qty), 0)}
        </div>

        {action && (
          <button
            onClick={() => onUpdate(order._id, action.to)}
            className="px-3 py-1 text-sm font-medium rounded-lg transition-all"
            style={{
              background: COLORS.blue,
              color: "#fff",
            }}
          >
            {action.label}
          </button>
        )}
      </div>
    </div>
  );
};

export default memo(OrderCard);
