/**
 * @description The index is the entry point of the application.
 * @module index
 */
var express = require("express");
var bodyParser = require("body-parser");
var app = express();

// extended = true to support nested JSON objects in requests
// this is utilized extensively for package requests
app.use(bodyParser.urlencoded({ extended: true }));



app.set("port", (process.env.PORT || DEFAULT_FALLBACK_PORT));
app.set("views", __dirname + "/views");
app.set("view engine", "ejs");

app.get("/", function(req, res) {
  var sess = req.session;
  res.render("pages/index", { "sess": sess });
});

app.listen(app.get("port"), function() {
  console.log("Node app is running on port", app.get("port"));
});
