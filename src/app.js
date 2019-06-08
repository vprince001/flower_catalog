const fs = require("fs");
const Express = require("./express.js");
const app = new Express();

const loadComments = function() {
  let comments_file = "./private_data/comments.json";
  if (!fs.existsSync(comments_file)) {
    fs.writeFileSync(comments_file, "[]", "utf8");
  }
  const commentsJSON = fs.readFileSync(comments_file, "utf8");
  return JSON.parse(commentsJSON);
};

const comments = loadComments();

const readPostBody = function(req, res, next) {
  let body = "";
  req.on("data", chunk => (body += chunk));
  req.on("end", () => {
    req.body = body;
    next();
  });
};

const createCommentsHTML = function(comments) {
  const commentsHTML = comments.map(({ date, name, comment }) => {
    return `<p>${date}: <strong>${name}</strong> : ${comment}</p>`;
  return commentsHTML.join("\n")
  });
};

const serveGuestBookPage = function(req, res) {
  fs.readFile("./public/guest_book.html", "utf8", (err, content) => {
    const commentsHTML = createCommentsHTML(comments);
    const guestBookPage = content.replace("___COMMENTS___", commentsHTML);
    send(res, 200, guestBookPage);
  });
};

const readArgs = text => {
  let args = {};
  const splitKeyValue = pair => pair.split("=");
  const assignKeyValueToArgs = ([key, value]) => {
    args[key] = unescape(unescape(value));
  };
  text
    .split("&")
    .map(splitKeyValue)
    .forEach(assignKeyValueToArgs);
  return args;
};

const saveComment = function(req, res) {
  const comment = readArgs(req.body);
  comment.date = new Date();
  comments.push(comment);
  fs.writeFile(
    "./private_data/comments.json",
    JSON.stringify(comments),
    err => {
      if (err) send(res, 500, "");
      serveGuestBookPage(req, res);
    }
  );
};

const requestHandler = function(req, res) {
  let filePath = "./public/" + req.url;
  if (req.url == "/") {
    filePath = "./public/index.html";
  }
  readFile(filePath, res);
};

const readFile = function(filePath, res) {
  fs.readFile(filePath, (error, content) => {
    if (error) {
      send(res, 404, "Page Not Found");
      return;
    }
    send(res, 200, content);
  });
};

const send = function(res, statusCode, content) {
  res.statusCode = statusCode;
  res.write(content);
  res.end();
};

const serveCookies = function(req,res) {
  let cookie = req.header['cookie'];
  let car;
  if(!cookie) {
    car = "bmw"
  }else {
    car = cookie.split('=')[1];
  }
  res.setHeaders("Set-Cookie",`car=${car}`);

}
  
app.use(readPostBody);
app.post('/readCookies',serveCookies);
app.get("/guest_book.html", serveGuestBookPage);
app.post("/guest_book.html", saveComment);
app.use(requestHandler);

module.exports = app.handleRequest.bind(app);
