const dateFormatOptions: Record<
  "standard" | "numeric",
  Intl.DateTimeFormatOptions
> = {
  standard: {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
  },
  numeric: {
    year: "numeric",
    month: "numeric",
    day: "numeric",
  },
};

export const getDateFormatted = (
  dateString: string,
  format: keyof typeof dateFormatOptions
) =>
  new Intl.DateTimeFormat("en", dateFormatOptions[format]).format(
    new Date(dateString)
  );
