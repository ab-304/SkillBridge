// In-memory data store for SkillBridge fallback execution (starts empty, zero dummy data)
class MemoryStore {
  constructor() {
    this.users = [];
    this.studentProfiles = [];
    this.companyProfiles = [];
    this.projects = [];
    this.applications = [];
    this.initialized = false;
  }

  async initSeed() {
    if (this.initialized) return;
    this.initialized = true;
    console.log('[MemoryStore] Clean state initialized (0 dummy records).');
  }
}

const memoryStore = new MemoryStore();
module.exports = memoryStore;
