const isMatching = function(route, req) {
  if (route.url && req.url != route.url) return false;
  if (route.method && req.method != route.method) return false;
  return true;
};

class Express {
  constructor() {
    this.routes = [];
  }

  use(handler) {
    this.routes.push({ handler });
  }

  get(url, handler) {
    this.routes.push({ method: "GET", url, handler });
  }

  post(url, handler) {
    this.routes.push({ method: "POST", url, handler });
  }

  handleRequest(req, res) {
    const matchingRoutes = this.routes.filter(route => isMatching(route, req));
    const next = () => {
      const currentRoute = matchingRoutes[0];
      if (!currentRoute) {
        return;
      }
      matchingRoutes.shift();
      currentRoute.handler(req, res, next);
    };
    next();
  }
}

module.exports = Express;
