/**
 * BaseAdapter: Abstract interface for all authoritative hackathon source adapters
 */
class BaseAdapter {
  /**
   * @param {Object} options
   * @param {string} options.name - Human-readable source name (e.g. 'Devfolio', 'Devpost')
   * @param {string} options.sourceType - 'official_platform' | 'organizer_website' | 'institutional'
   * @param {number} options.priority - 1 (highest) to 6 (lowest) per Authoritative Source Policy
   * @param {number} [options.timeoutMs=10000] - Request timeout in milliseconds
   */
  constructor({ name, sourceType, priority, timeoutMs = 10000 }) {
    if (!name) throw new Error("Adapter must have a name");
    this.name = name;
    this.sourceType = sourceType || "official_platform";
    this.priority = priority || 6;
    this.timeoutMs = timeoutMs;
  }

  /**
   * Fetch raw response from external endpoint with timeout and standard User-Agent
   * @param {string} url 
   * @param {Object} [headers={}] 
   * @returns {Promise<any>}
   */
  async fetchWithTimeout(url, headers = {}) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), this.timeoutMs);

    try {
      const response = await fetch(url, {
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) HackHubDataEngine/1.0",
          Accept: "application/json, text/plain, */*",
          ...headers,
        },
        signal: controller.signal,
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status} ${response.statusText}`);
      }

      return await response.json();
    } finally {
      clearTimeout(timeout);
    }
  }

  /**
   * Execute discovery cycle for this adapter
   * @returns {Promise<{ success: boolean, hackathons: Array, error?: string }>}
   */
  async discover() {
    throw new Error(`discover() must be implemented by adapter ${this.name}`);
  }
}

module.exports = BaseAdapter;
