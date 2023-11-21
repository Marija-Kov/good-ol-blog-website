import NodeCache from "node-cache";
const cache = new NodeCache();

const routeCache = (duration) => {
  return (req, res, next) => {
    if (req.method !== "GET") {
      console.error("Only GET methods can be cached");
      return next();
    }
    const key = req.originalUrl;
    const cachedResponse = cache.get(key);
    if (cachedResponse) {
      console.log(`Cache hit for ${key}`);
      res.send(cachedResponse);
    } else {
      console.log(`Cache miss for ${key}`);
      res.originalSend = res.send;
      res.send = (body) => {
        console.log(body)
        res.originalSend(body);
        cache.set(key, body, duration);
      };
      next();
    }
  };
};

export default routeCache;
