import React from "react";
import { cn } from "@/lib/utils";
import { DayPicker } from "react-day-picker";
import { DateRange } from "react-day-picker";
import { format } from "date-fns";

interface DatePickerWithRangeProps {
  dateRange: DateRange | undefined;
  setDateRange: (dateRange: DateRange | undefined) => void;
}

export function DatePickerWithRange({
  dateRange,
  setDateRange,
}: DatePickerWithRangeProps) {
  return (
    <DayPicker
      mode="range"
      className={cn("flex p-3")}
      selected={dateRange}
      onSelect={setDateRange}
      numberOfMonths={1}
      captionLayout="dropdown"
    />
  );
}