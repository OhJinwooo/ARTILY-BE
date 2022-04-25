const express = require("express");
const app = express();
const port = 5000;
const cors = require("cors");
const session = require('express-session')

const authRouter = require("./Social/kakao-auth/kakao/kakao");
const passportKakao = require("./Social/kakao-auth");
const gitHub = require("./Social/github-auth/github")
const connect = require("./schemas")


passportKakao();
gitHub();
connect();

app.use(session({secret:'MySecret', resave: false, saveUninitialized:true}));
app.use(passport.initialize());
app.use(passport.session());
app.use(cors());
app.use("/oauth", authRouter);


app.use('/', require('./Social/google-auth/routes/main'));
app.use('/auth', require('./Social/google-auth/routes/auth'));

app.listen(port, () => {
  console.log(port, "서버가 연결되었습니다.");
});