export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

export const formatTime = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });
};

export const formatDateTime = (dateString: string): string => {
  return `${formatDate(dateString)} at ${formatTime(dateString)}`;
};

export const localDateTimeToISO = (localDateTime: string): string => {
  return new Date(localDateTime).toISOString();
};

export const isoToLocalDateTime = (isoString: string): string => {
  const date = new Date(isoString);

  return date.toISOString().slice(0, 16);
};

export const isValidDateRange = (start: string, end: string): boolean => {
  const startDate = new Date(start);
  const endDate = new Date(end);

  return startDate < endDate;
};

export const isValidFutureDate = (dateString: string): boolean => {
  const date = new Date(dateString);
  const now = new Date();

  return date > now;
};

export const cn = (...classes: (string | undefined | false)[]): string => {
  return classes.filter(Boolean).join(' ');
}; 