import dayjs from "dayjs";
import locale from "dayjs/locale/fr";
import localizedFormat from "dayjs/plugin/localizedFormat";

dayjs.extend(localizedFormat);
dayjs.locale(locale);

export const getMillisecondsDiff = (date1: string, date2: string) => {
  return dayjs(date1).diff(date2);
};
