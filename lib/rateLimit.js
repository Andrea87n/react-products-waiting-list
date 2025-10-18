const WINDOWS_MS = 60 * 1000;
const MAX_REQUESTS = 5;

const requests = new Map();

export function rateLimit(ip) {
  const now = Date.now();
  const record = requests.get(ip);

  if (!record) {
    requests.set(ip, { count: 1, firstRequest: now });
    return { allowed: true };
  }

  if (now - record.firstRequest > WINDOWS_MS) {
    requests.set(ip, { count: 1, firstRequest: now });
    return { allowed: true }
  }

  record.count++;

  if (record.count > MAX_REQUESTS) {
    const retryAfter = Math.ceil((WINDOWS_MS - (now - record.firstRequest)) / 1000);
    return { allowed: false, retryAfter };
  }

  return { allowed: true };

}

