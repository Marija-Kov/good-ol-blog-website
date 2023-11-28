import NodeCache from "node-cache";
class RouteCache {
  constructor() {
    this.cache = new NodeCache();
    this.middleware = this.middleware.bind(this);
    this.flush = this.flush.bind(this);
  }
  middleware(duration) {
    return (req, res, next) => {
      if (req.method !== "GET") {
        console.error("Only GET methods can be cached");
        return next();
      }
      const key = req.originalUrl;
      const cachedResponse = this.cache.get(key);
      if (cachedResponse) {
        res.send(cachedResponse);
      } else {
        res.originalSend = res.send;
        res.send = (body) => {
          res.originalSend(body);
          this.cache.set(key, body, duration);
        };
        next();
      }
    };
  }

  flush() {
    this.cache.flushAll();
  }
}

export default new RouteCache();
