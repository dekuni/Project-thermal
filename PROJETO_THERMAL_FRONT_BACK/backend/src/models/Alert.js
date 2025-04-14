// backend/src/models/Alert.js
class Alert {
    constructor({ id, time, message, device, status, resolvedAt }) {
      this.id = id;
      this.time = time || new Date().toISOString().replace('T', ' ').substring(0, 19);
      this.message = message;
      this.device = device;
      this.status = status || 'open';
      
      if (status === 'resolved' && resolvedAt) {
        this.resolvedAt = resolvedAt;
      }
    }
    
    resolve() {
      this.status = 'resolved';
      this.resolvedAt = new Date().toISOString().replace('T', ' ').substring(0, 19);
      return this;
    }
    
    toJSON() {
      return {
        id: this.id,
        time: this.time,
        message: this.message,
        device: this.device,
        status: this.status,
        ...(this.resolvedAt && { resolvedAt: this.resolvedAt })
      };
    }
  }
  
  module.exports = { Alert };