import type { UseTimeAgoUnitNamesDefault } from '@vueuse/core'
import { formatTimeAgo } from '@vueuse/core'

export function formatTimeAgoWithI18n(from: Date) {
  const { t } = useI18n()
  return formatTimeAgo<UseTimeAgoUnitNamesDefault>(from, {
    messages: {
      justNow: t('time-ago.just-now'),
      past: n => (n.match(/\d/) ? t('time-ago.past', { n }) : n),
      future: n => (n.match(/\d/) ? t('time-ago.future', { n }) : n),
      month: (n, past) =>
        n === 1
          ? past
            ? t('time-ago.month.past')
            : t('time-ago.month.future')
          : t('time-ago.month.n', { n }),
      year: (n, past) =>
        n === 1
          ? past
            ? t('time-ago.year.past')
            : t('time-ago.year.future')
          : t('time-ago.year.n', { n }),
      day: (n, past) =>
        n === 1
          ? past
            ? t('time-ago.day.past')
            : t('time-ago.day.future')
          : t('time-ago.day.n', { n }),
      week: (n, past) =>
        n === 1
          ? past
            ? t('time-ago.week.past')
            : t('time-ago.week.future')
          : t('time-ago.week.n', { n }),
      hour: n => t('time-ago.hour', { n }),
      minute: n => t('time-ago.minute', { n }),
      second: n => t('time-ago.second', { n }),
      invalid: 'invalid',
    },
  })
}
