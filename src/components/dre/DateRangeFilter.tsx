import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar, Filter } from "lucide-react";

interface DateRangeFilterProps {
  startDate: string;
  endDate: string;
  onStartDateChange: (date: string) => void;
  onEndDateChange: (date: string) => void;
}

export const DateRangeFilter: React.FC<DateRangeFilterProps> = ({
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange,
}) => {
  return (
    <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
      <CardContent className="p-4 sm:p-6">
        <div className="flex items-center gap-2 mb-3 sm:mb-4">
          <Filter className="h-4 w-4 text-green-600" />
          <Label className="text-sm sm:text-base font-semibold text-gray-700">
            Filtro por Período
          </Label>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="start-date" className="text-xs sm:text-sm font-medium text-gray-600">
              Data Início
            </Label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                id="start-date"
                type="date"
                value={startDate}
                onChange={(e) => onStartDateChange(e.target.value)}
                className="fluxo-input pl-10 h-10 text-sm"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="end-date" className="text-xs sm:text-sm font-medium text-gray-600">
              Data Fim
            </Label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                id="end-date"
                type="date"
                value={endDate}
                onChange={(e) => onEndDateChange(e.target.value)}
                className="fluxo-input pl-10 h-10 text-sm"
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};