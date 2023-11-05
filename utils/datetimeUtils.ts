import dayjs from 'dayjs';
import 'dayjs/plugin/timezone'; // Import timezone plugin for dayjs
import utc from 'dayjs/plugin/utc'; // Import utc plugin for dayjs

dayjs.extend(utc);
dayjs.extend(require('dayjs/plugin/timezone'));

type GetDifferenceInDatesPayloadT = {
  endDate: Date;
  diffType?: 'days' | 'months' | 'years' | 'hours' | 'minutes';
  startDate?: Date;
};

export const getDifferenceInDates = (payload: GetDifferenceInDatesPayloadT) => {
  const { startDate, endDate, diffType } = payload;
  const start = dayjs(startDate ? startDate : new Date());
  const end = dayjs(endDate);
  const diff = end.diff(start, `${diffType ? diffType : 'minutes'}`);
  return diff;
};

export const getTimezone = () => {
  return dayjs.tz.guess(); // Get the guessed timezone using dayjs
};

export const formatUTCDate = (date: string, outputFormat: string) => {
  const profileTimezone = getTimezone();
  const tzTime = dayjs.utc(date).tz(profileTimezone).format(outputFormat);
  return tzTime;
};

export const convertLocalDateToUTC = (localDate: string, inputFormat: string, outputFormat: string = 'YYYY-MM-DDTHH:mm:ss[Z]'): string => {
  const utcDate = dayjs(localDate, inputFormat).utc().format(outputFormat);
  return utcDate;
};

export const getLastPublished = (utcTimeStamp: string) => {
  const formattedDate = formatUTCDate(utcTimeStamp, 'YYYY-MM-DD HH:mm:ss');
  const currentDate = dayjs();

  const timeDifferenceMinutes = getDifferenceInDates({
    endDate: currentDate.toDate(),
    startDate: dayjs(formattedDate).toDate(),
  });

  if (timeDifferenceMinutes < 1) {
    return 'Just now';
  } else if (timeDifferenceMinutes < 60) {
    return `${timeDifferenceMinutes} minute${timeDifferenceMinutes !== 1 ? 's' : ''} ago`;
  } else if (timeDifferenceMinutes < 1440) {
    const hours = Math.floor(timeDifferenceMinutes / 60);
    return `${hours} hour${hours !== 1 ? 's' : ''} ago`;
  } else if (timeDifferenceMinutes < 10080) {
    const days = Math.floor(timeDifferenceMinutes / 1440);
    return `${days} day${days !== 1 ? 's' : ''} ago`;
  } else if (timeDifferenceMinutes < 525600) {
    const weeks = Math.floor(timeDifferenceMinutes / 10080);
    return `${weeks} week${weeks !== 1 ? 's' : ''} ago`;
  } else {
    const years = Math.floor(timeDifferenceMinutes / 525600);
    return `${years} year${years !== 1 ? 's' : ''} ago`;
  }
};

export type DateAndTimeFormatsKeysT = 'DATE' | 'TIME' | 'DATETIME';

export const DateAndTimeFormats: Record<DateAndTimeFormatsKeysT, string> = {
  DATE: 'D MMMM YYYY',
  DATETIME: 'D MMMM YYYY, hh:mm a',
  TIME: 'h:mm a',
};

export function getStartAndEndDate(type: 'DAY' | 'MONTH' | 'WEEK') {
  let startDate;
  let endDate = dayjs();

  if (type === 'DAY') {
    startDate = endDate.subtract(24, 'hour');
  } else if (type === 'WEEK') {
    // Get the start of the current week (Sunday) and end of the week (Saturday)
    startDate = endDate.startOf('week');
    endDate = endDate.endOf('week');
  } else {
    // Get the start of the current month and end of the month
    startDate = endDate.startOf('month');
    endDate = endDate.endOf('month');
  }

  // Convert dates to UTC strings
  const startUTC = startDate.toISOString();
  const endUTC = endDate.toISOString();

  return { startUTC, endUTC };
}
