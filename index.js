const express = require('express');
const exphbs = require('express-handlebars');
const session = require('express-session');
const FileStore = require('session-file-store')(session);
const flash = require('express-flash');
const conn = require('./db/conn');

const ToughtController = require('./controllers/ToughtController');

//Import das rotas
const toughtsRoutes = require('./routes/toughtsRoutes');
const authRoutes = require('./routes/authRoutes');

const PORT = 3000;
const app = express();

const Tought = require('./models/Tought');
const User = require('./models/User');

app.engine('handlebars', exphbs.engine());
app.set('view engine', 'handlebars');
app.use(
  express.urlencoded({ extended: true }),
  express.json(),
  express.static('public')
)

//session middleware
app.use(
  session({
    name: 'session',
    secret: 'nosso_secret_102032',
    resave: false,
    saveUninitialized: false,
    store: new FileStore({
      logFn: function () {},
      path: require('path').join(require('os').tmpdir(), 'sessions')
    }),
    cookie: {
      secure: false,
      maxAge: 360000,
      expires: new Date(Date.now() + 360000),
      httpOnly: true
    }
  }),
)

//flash messages
app.use(flash());

//salvar sessão na resposta
app.use((req, res, next) => {
  if (req.session.userid) {
    res.locals.session = req.session
  }
  next();
});

//Rotas
app.use('/toughts', toughtsRoutes);
app.use('/', authRoutes);

app.get('/', ToughtController.showToughts);

conn
  .sync()
  .then(() => app.listen(PORT, () => console.log(`Executando API na porta ${PORT}.`)))
  .catch(error => console.log(error));