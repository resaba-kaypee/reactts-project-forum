import {
  // format,
  differenceInMinutes,
  differenceInDays,
} from "date-fns";

// const StandardDateTimeFormat = "M/dd/yyyy";
export const getTimePassIfLessThanDay = (compTime: Date | null): string => {
  if (!compTime) return "";

  const now = new Date();
  const thisDate = new Date(compTime);
  const diffInMinutes = differenceInMinutes(now, thisDate);
  const diffInDays = differenceInDays(now, thisDate);

  if (diffInMinutes > 60) {
    if (diffInMinutes > 24 * 60) {
      // return format(thisDate, StandardDateTimeFormat)
      return `${diffInDays} days ago`;
    }
    return `${Math.round(diffInMinutes / 60)} h ago`;
  }
  return `${Math.round(diffInMinutes)} m ago`;
};
