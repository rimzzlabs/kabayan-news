import { format, formatDistanceToNow } from "date-fns";
import { toZonedTime } from "date-fns-tz";
import { id } from "date-fns/locale";

/**
 *
 * @param token default to `"dd MMM yyyy"`
 * @returns
 */
export function formatDate(token = "dd MMM yyyy") {
  return (dateValue: Date | number | string) => {
    let tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    return format(toZonedTime(dateValue, tz), token, { locale: id });
  };
}

export function formatDistance(dateValue: Date | number | string) {
  let tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
  return formatDistanceToNow(toZonedTime(dateValue, tz), {
    locale: id,
    addSuffix: true,
  });
}
