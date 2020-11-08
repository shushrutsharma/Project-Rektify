const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const morgan = require("morgan");
const Teacher = require("./models/Teacher")
const path = require('path')
const Doubt = require("./models/Doubt")
const mailController = require("./mailer");
const fetch = require('node-fetch');

const app = express();
app.set("port", 8080);


/* Middelware */
app.use(morgan("dev"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.set('view engine', 'ejs'); 
app.use(express.static(path.join(__dirname, 'views')));
app.use(
    session({
      key: "user_sid",
      secret: "somerandonstuffs",
      resave: false,
      saveUninitialized: false,
      cookie: {
        expires: 600000,
      },
    })
  );

  app.use((req, res, next) => {
    if (req.cookies.user_sid && !req.session.user) {
      res.clearCookie("user_sid");
    }
    next();
  });

  var sessionCheckerteacher = (req, res, next) => {
    if (req.session.user && req.cookies.user_sid) {
      res.redirect("/teacher/dashboard");
    } else {
      next();
    }
  };


  /* Routes */
  app.get("/", (req, res) => {
    res.render("chatbot")
  });


  app.get("/teacher", sessionCheckerteacher, (req, res) => {
    res.redirect("/teacher/login");
  });


  app
  .route("/teacher/signup")
  .get(sessionCheckerteacher, (req, res) => {
    res.render('signup')
  })
  .post((req, res) => {

    var user = new Teacher({
      username: req.body.username,
      email: req.body.email,
      password:req.body.password,
    });
    user.save((err, docs) => {
      if (err) {
        res.redirect("/teacher/signup");
      } else {
          console.log(docs)
        req.session.user = docs;
        res.redirect("/teacher/dashboard");
      }
    });
  });



  app
  .route("/teacher/login")
  .get(sessionCheckerteacher, (req, res) => {
    res.render('teacherlogin');
  })
  .post(async (req, res) => {
    var username = req.body.username,
      password = req.body.password;

      try {
        var user = await Teacher.findOne({ username: username }).exec();
        if(!user) {
            res.redirect("/teacher/login");
        }
        user.comparePassword(password, (error, match) => {
            if(!match) {
              res.redirect("/teacher/login");
            }
        });
        req.session.user = user;
        res.redirect("/teacher/dashboard");
    } catch (error) {
      console.log(error)
    }
  });

  app
  .route("/user/addDoubt")
  .post((req, res) => {

    var dt = new Doubt({
      email: req.body.email,
      doubt:req.body.doubt,
    });
    dt.save((err, docs) => {
      if (err) {
        res.redirect("/teacher/signup");
      } else {
        res.render("chatbotAns", { status: {
          msg: "Your Question has been recorded"
        }
      });
      }
    });
  });


  app.get("/teacher/dashboard",async(req, res, next) => {
    if (req.session.user && req.cookies.user_sid){
      try {
        const doubts = await Doubt.find();
        console.log(doubts)
        res.render('teacherdashboard', { doubts: doubts });
    } catch (err) {
        next(err);
    }
  }
  else {
    res.redirect("/teacher/login");
  }
});

  app.get("/logout", (req, res) => {
    if (req.session.user && req.cookies.user_sid) {
      res.clearCookie("user_sid");
      res.redirect("/teacher/login");
    } else {
      res.redirect("/teacher/login");
    }
  });

  app.get("/teacher/solve/:doubtID", async(req,res)=>{
    try {
      var doubt = await Doubt.findOne({ _id: req.params.doubtID }).exec();
      if(!doubt) {
          res.redirect("/teacher/dashboard");
      }
      res.render('popupAns', {doubt: doubt});
  } catch (error) {
    console.log(error)
  }
  })
  
  app.post("/teacher/solve/:doubtID", async(req,res)=>{
  
    try {
      var doubt = await Doubt.findOne({ _id: req.params.doubtID }).exec();
      if(!doubt) {
          res.redirect("/teacher/dashboard");
      }
      var todo = {
        question: doubt.doubt,
        answer: req.body.ans
      }
      fetch('https://rektify-bot.azurewebsites.net/kb/new', {
    method: 'POST',
    body: JSON.stringify(todo),
    headers: { 'Content-Type': 'application/json' }
    }).then(res => res.json())
    .then(json => console.log(json));
      mailController.sendMail(doubt);
      try {
        const dts = await Doubt.find();
        
        res.render('tdashboardans.ejs', { doubts: dts });
    } catch (err) {
        next(err);
    }
      Doubt.deleteOne({ _id: req.params.doubtID }, function (err) {
        if(err) console.log(err);
        console.log("Successful deletion");
      });
  } catch (error) {
    console.log(error)
  }
  })

  app.use(function (req, res, next) {
    res.status(404).send("Sorry can't find that!");
  });
 


app.listen(app.get("port"), () =>
  console.log(`App started on port ${app.get("port")}`)
);