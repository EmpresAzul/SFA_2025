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
    flex justify-between items-center py-2 px-4
    ${isTotal ? "bg-gradient-to-r from-fluxo-blue-50 to-fluxo-blue-100 border-t-2 border-fluxo-blue-300 font-bold text-lg" : ""}
    ${isSubtotal ? "bg-gray-50 border-t border-gray-200 font-semibold" : ""}
    ${level > 0 ? `ml-${level * 4}` : ""}
  `}
  >
    <div className="flex-1">
      <span
        className={`
        ${isTotal ? "text-fluxo-blue-800" : ""}
        ${isSubtotal ? "text-gray-700" : "text-gray-600"}
        ${isNegative ? "text-red-600" : ""}
      `}
      >
        {isNegative && "(-) "}
        {label}
      </span>
      {detalhes && Object.keys(detalhes).length > 0 && (
        <div className="text-xs text-gray-500 mt-1 ml-4">
          {Object.entries(detalhes).map(([cat, val]) => (
            <div key={cat} className="flex justify-between">
              <span>{cat}</span>
              <span>{formatCurrency(val)}</span>
            </div>
          ))}
        </div>
      )}
    </div>
    <span
      className={`
      font-mono ml-4
      ${isTotal ? "text-fluxo-blue-800 text-xl" : ""}
      ${isSubtotal ? "text-gray-700 font-semibold" : "text-gray-600"}
      ${value < 0 ? "text-red-600" : value > 0 ? "text-green-600" : "text-gray-600"}
    `}
    >
      {formatCurrency(value)}
    </span>
  </div>
);

export default DRELineItem;
