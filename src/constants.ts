export const CONFIG = {
  wss:
    process.env.NEXT_PUBLIC_WEBSOCKET_URL ??
    'wss://6se5wu8bt9.execute-api.eu-central-1.amazonaws.com/prod',
}

/**
 * Zone the statistics calendar is cut and labelled in. The backend cuts day and
 * month buckets in this same zone (STATISTICS_TIME_ZONE in telegram-bot-app);
 * changing one without the other shifts every bucket against its label.
 */
export const STATISTICS_TIME_ZONE = 'Europe/Stockholm'
