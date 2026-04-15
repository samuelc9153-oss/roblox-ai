// Keep-alive pinger - prevents free tier hosts from sleeping
// Pings your own server every 4 minutes 24/7

const PING_INTERVAL_MS = 4 * 60 * 1000; // 4 minutes

function keepAlive() {
  const baseUrl = process.env.APP_URL || `http://localhost:${process.env.PORT || 3000}`;
  
  setInterval(async () => {
    try {
      const res = await fetch(`${baseUrl}/health`);
      const data = await res.json();
      console.log(`[KeepAlive] ✓ ${new Date().toISOString()} | uptime: ${Math.floor(data.uptime)}s`);
    } catch (err) {
      console.error(`[KeepAlive] ✗ Ping failed: ${err.message}`);
    }
  }, PING_INTERVAL_MS);

  console.log(`[KeepAlive] 🔄 Pinging ${baseUrl}/health every 4 minutes`);
}

module.exports = { keepAlive };
