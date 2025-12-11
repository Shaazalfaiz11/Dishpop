import { Star, TrendingUp, Users } from "lucide-react";

export default function FeedbackSummary() {
  const stats = [
    { label: "Excellent", value: "120", className: "text-blue-400" },
    { label: "Average", value: "34", className: "text-yellow-400" },
    { label: "Poor", value: "5", className: "text-red-400" },
  ];

  return (
    <div
      className="relative group bg-[#0D1017] border border-[#1F2532]
      rounded-2xl p-6 shadow-[0_0_25px_-10px_rgba(0,0,0,0.6)]
      transition-all duration-500 hover:shadow-[0_0_37px_-10px_rgba(30,58,138,0.6)]"
    >
      {/* Subtle Glass Shine */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-white/5 to-transparent pointer-events-none"></div>

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-sm font-semibold tracking-wide text-gray-200">
            Feedback Summary
          </h2>
          <p className="text-[11px] text-gray-500 mt-1">
            Customer sentiments performance
          </p>
        </div>
        <div className="w-8 h-8 bg-blue-500/10 flex items-center justify-center rounded-lg">
          <Star className="w-4 h-4 text-blue-400" />
        </div>
      </div>

      {/* Score */}
      <div className="mt-6 space-y-2">
        <div className="flex items-end gap-2">
          <p className="text-5xl font-extrabold tracking-tight bg-gradient-to-r from-blue-400 to-blue-300 text-transparent bg-clip-text drop-shadow">
            4.7
          </p>
          <span className="text-xs text-gray-500 mb-1">/5</span>
        </div>

        {/* Progress Bar */}
        <div className="w-full h-2 bg-[#1A1F2B] rounded-full overflow-hidden">
          <div className="h-full rounded-full bg-gradient-to-r from-blue-500 to-blue-300" style={{ width: "92%" }}></div>
        </div>

        <div className="flex items-center gap-1 text-[11px] text-gray-400">
          <TrendingUp className="w-3 h-3 text-green-400" />
          92% overall positive rating
        </div>
      </div>

      {/* Rating Categories */}
      <div className="grid grid-cols-3 gap-3 mt-6">
        {stats.map((item, i) => (
          <div
            key={i}
            className="bg-[#12151D] border border-[#232A37] rounded-lg py-3
            transition-all duration-300 hover:border-blue-400/50 hover:translate-y-[-2px]
            hover:shadow-[0_0_20px_-5px_rgba(59,130,246,0.35)]"
          >
            <p className="text-[11px] text-center text-gray-500">{item.label}</p>
            <p className={`text-sm font-bold text-center ${item.className}`}>{item.value}</p>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="mt-6 flex items-center gap-2 text-[11px] text-gray-500">
        <Users className="w-3.5 h-3.5" />
        159 Responses Counted
      </div>
    </div>
  );
}
