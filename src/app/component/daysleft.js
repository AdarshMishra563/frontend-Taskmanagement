export default function getTimeDiff(targetDate) {
  const now = new Date();
  const target = new Date(targetDate);
  const diffInMs = target - now;


  if (diffInMs <= 0) return { days: 0, hours: 0 };

  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
  const diffInHours = Math.floor((diffInMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

  return { days: diffInDays, hours: diffInHours };
}
