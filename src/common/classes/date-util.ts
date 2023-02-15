export enum TimePeriod {
  Minute = 'minute',
  Hour = 'hour',
  Day = 'day',
  Week = 'week',
  Month = 'month',
}

export class DateUtil {
  public static addPeriodToNow(period: TimePeriod, times = 1) {
    switch (period) {
      case TimePeriod.Minute:
        return DateUtil.addMinutesToNow(times);
      case TimePeriod.Hour:
        const MINUTES_IN_HOUR = 60;
        return DateUtil.addMinutesToNow(MINUTES_IN_HOUR * times);
      case TimePeriod.Day:
        const MINUTES_IN_DAY = 1440;
        return DateUtil.addMinutesToNow(MINUTES_IN_DAY * times);
      default:
        return new Date();
    }
  }

  public static subtractPeriodFromNow(period: TimePeriod, times = 1) {
    switch (period) {
      case TimePeriod.Day:
        return DateUtil.subtractDaysFromNow(times);
      case TimePeriod.Week:
        const daysInWeek = 7;
        return DateUtil.subtractDaysFromNow(daysInWeek * times);
      case TimePeriod.Month:
        const daysInMonth = 30;
        return DateUtil.subtractDaysFromNow(daysInMonth * times);
      default:
        return new Date();
    }
  }

  public static calculateDifferenceInHourseBetweenTwoDays(x: Date, y: Date) {
    return Math.abs(x.getTime() - y.getTime()) / 3600000;
  }

  public static getDifferenceBetweenDateAndNow(date: Date) {
    const now = new Date();
    let delta = Math.abs(date.getTime() - now.getTime()) / 1000;

    const SECONDS_IN_DAY = 86400;
    const days = Math.floor(delta / SECONDS_IN_DAY);
    delta -= days * SECONDS_IN_DAY;

    const SECONDS_IN_HOUR = 3600;
    const hours = Math.floor(delta / SECONDS_IN_HOUR) % 24;
    delta -= hours * 3600;

    const SECONDS_IN_MINUTE = 60;
    const minutes = Math.floor(delta / SECONDS_IN_MINUTE) % 60;
    delta -= minutes * SECONDS_IN_MINUTE;

    let result = ``;

    if (days) {
      result += `${days}d `;
    }

    if (hours) {
      result += `${hours}h `;
    }

    if (minutes) {
      result += `${minutes}m`;
    }

    return result.trim();
  }

  private static addMinutesToNow(minutes: number) {
    const now = new Date();
    now.setMinutes(now.getMinutes() + minutes);

    return now;
  }

  private static subtractDaysFromNow(days: number) {
    const now = new Date();
    now.setDate(now.getDate() - days);

    return now;
  }
}
