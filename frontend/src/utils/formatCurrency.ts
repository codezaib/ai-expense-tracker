import { format } from "date-fns";

export const formatCurrency = (amount: number, currencyCode = "USD") => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currencyCode,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount);
};

export const formatDate = (date: Date | string, formatStr = "PPP") => {
  return format(new Date(date), formatStr);
};
