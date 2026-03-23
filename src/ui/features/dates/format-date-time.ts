import dayjs from "dayjs";

export const formatDateTime = (
  dateTime: string | null | undefined
): string | null => {
  if (!dateTime) return null;
  return dayjs(dateTime).format("MM/DD/YYYY HH:mm");
};
