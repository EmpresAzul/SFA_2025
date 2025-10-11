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
    flex justify-between items-center py-2 px-4 sm:px-6 text-xs sm:text-sm border-b border-gray-100
    ${isTotal ? "bg-gradient-to-r from-indigo-50 to-purple-50 border-t-2 border-indigo-300 font-bold py-3" : ""}
    ${isSubtotal ? "bg-slate-100 border-t border-slate-300 font-semibold py-2.5" : ""}
    ${level > 0 ? "pl-8 sm:pl-12" : ""}
    hover:bg-gray-50/80 transition-all duration-150
  `}
  >
    <div className="flex-1 min-w-0">
      <span
        className={`
        block truncate
        ${isTotal ? "text-indigo-900 font-bold text-sm sm:text-base" : ""}
        ${isSubtotal ? "text-slate-800 font-semibold text-sm" : "text-slate-700"}
        ${isNegative ? "text-red-700" : ""}
      `}
      >
        {label}
      </span>
      {detalhes && Object.keys(detalhes).length > 0 && (
        <div className="text-xs text-slate-500 mt-1.5 ml-4 space-y-1">
          {Object.entries(detalhes).map(([cat, val]) => (
            <div key={cat} className="flex justify-between gap-2">
              <span className="truncate flex-1 min-w-0">{cat}</span>
              <span className="font-mono text-slate-600 flex-shrink-0">{formatCurrency(val)}</span>
            </div>
          ))}
        </div>
      )}
    </div>
    <span
      className={`
      font-mono ml-4 min-w-[100px] sm:min-w-[130px] text-right flex-shrink-0
      ${isTotal ? "text-indigo-900 font-bold text-sm sm:text-base" : ""}
      ${isSubtotal ? "text-slate-800 font-semibold text-sm" : "text-slate-700 text-xs sm:text-sm"}
      ${value < 0 ? "text-red-700 font-semibold" : value > 0 ? "text-green-700 font-semibold" : "text-slate-700"}
    `}
    >
      {formatCurrency(value)}
    </span>
  </div>
);

export default DRELineItem;
