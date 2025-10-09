import React from "react";
import { formatCurrency } from "@/utils/currency";

interface DRELineItemProps {
  label: string;
  value: number;
  isSubtotal?: boolean;
  isTotal?: boolean;
  isNegative?: boolean;
  level?: number;
  detalhes?: { [key: string]: number } | null;
}

const DRELineItem: React.FC<DRELineItemProps> = ({
  label,
  value,
  isSubtotal = false,
  isTotal = false,
  isNegative = false,
  level = 0,
  detalhes = null,
}) => (
  <div
    className={`
    flex flex-col sm:flex-row sm:justify-between sm:items-center py-2 sm:py-1.5 px-3 sm:px-4 lg:px-6 text-xs sm:text-sm
    ${isTotal ? "bg-gradient-to-r from-indigo-50 to-purple-50 border-t-2 border-indigo-300 font-bold text-sm sm:text-base" : ""}
    ${isSubtotal ? "bg-slate-50 border-t border-slate-200 font-semibold" : ""}
    ${level > 0 ? `sm:ml-${level * 4}` : ""}
    hover:bg-gray-50 transition-colors duration-150
  `}
  >
    <div className="flex-1 mb-1 sm:mb-0">
      <span
        className={`
        block sm:inline break-words
        ${isTotal ? "text-indigo-800" : ""}
        ${isSubtotal ? "text-slate-700" : "text-slate-600"}
        ${isNegative ? "text-red-600" : ""}
      `}
      >
        {isNegative && "(-) "}
        {label}
      </span>
      {detalhes && Object.keys(detalhes).length > 0 && (
        <div className="text-xs text-slate-500 mt-1 sm:ml-4 space-y-0.5">
          {Object.entries(detalhes).map(([cat, val]) => (
            <div key={cat} className="flex justify-between">
              <span className="truncate max-w-[150px] sm:max-w-[200px]">{cat}</span>
              <span className="font-mono text-xs">{formatCurrency(val)}</span>
            </div>
          ))}
        </div>
      )}
    </div>
    <span
      className={`
      font-mono sm:ml-4 min-w-[100px] sm:min-w-[120px] text-right
      ${isTotal ? "text-indigo-800 text-sm sm:text-base font-bold" : ""}
      ${isSubtotal ? "text-slate-700 font-semibold" : "text-slate-600"}
      ${value < 0 ? "text-red-600" : value > 0 ? "text-green-600" : "text-slate-600"}
    `}
    >
      {formatCurrency(value)}
    </span>
  </div>
);

export default DRELineItem;
