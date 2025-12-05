import { useMemo, useState } from "react";

export default function TableOrdersOverview() {
  const dummyStatuses = ["pending", "preparing", "ready"];

  // Generate tables once (memoized)
  const generatedTables = useMemo(() => {
    return Array.from({ length: 16 }, (_, i) => ({
      id: `T${i + 1}`,
      status: dummyStatuses[Math.floor(Math.random() * dummyStatuses.length)],
    }));
    // No dependencies → runs only once
  }, []);

  const [tables] = useState(generatedTables);

  const activeOrders = tables.filter((t) => t.status !== "ready").length;

  const statusCount = (s) =>
    tables.filter((t) => t.status === s).length;

  const getColor = (status) => {
    switch (status) {
      case "pending":
        return "bg-[#862727] text-white";
      case "preparing":
        return "bg-[#9A572A] text-white";
      case "ready":
        return "bg-[#1D2A42] text-blue-400 border border-blue-500";
      default:
        return "bg-[#2A2F3B]";
    }
  };

  return (
   <div
      className="relative group bg-[#0D1017] border border-[#1F2532]
      rounded-2xl p-6 shadow-[0_0_25px_-10px_rgba(0,0,0,0.6)]
      transition-all duration-500 hover:shadow-[0_0_37px_-10px_rgba(30,58,138,0.6)]"
    >

       <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-white/5 to-transparent pointer-events-none"></div>

      {/* Header */}
      <h2 className="text-lg font-semibold">Table Orders Overview</h2>
      <p className="text-xs text-gray-400">Real-time status of active table orders</p>

      {/* Orders Count */}
      <div className="mt-4">
        <p className="text-4xl font-bold text-blue-400">{activeOrders}</p>
        <p className="text-[11px] text-gray-400 mb-3">Active Table Orders</p>

        {/* Status Summary */}
        <div className="flex items-center gap-5 text-[11px] text-gray-300">
          <span>Pending: {statusCount("pending")}</span>
          <span>Preparing: {statusCount("preparing")}</span>

          {/* Delivered Badge */}
          <div className="flex items-center gap-1">
            <span>Ready: {statusCount("ready")}</span>
            <span className="px-2 py-[2px] rounded-md bg-[#13253A] border border-blue-500 text-blue-400 text-[9px]">
              Delivered
            </span>
          </div>
        </div>
      </div>

      {/* Heatmap Grid */}
      <div className="grid grid-cols-4 gap-3 mt-6">
        {tables.map((table) => (
          <div
            key={table.id}
            className={`rounded-md h-10 flex items-center justify-center text-[10px] font-semibold cursor-pointer transition-transform duration-200 hover:scale-105 hover:shadow-lg ${getColor(
              table.status
            )}`}
          >
            {table.id}
          </div>
        ))}
      </div>
    </div>
  );
}
