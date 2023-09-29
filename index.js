const express = require('express')
const path = require('path')
const exphbs = require('express-handlebars')
const session = require('express-session')
const FileStore = require('session-file-store')(session)
const flash = require('express-flash')


const app = express()

const conn = require('./db/conn')

//models
const Tought = require('./models/Tought')
const User = require('./models/User')

//routes
const toughtsRoutes = require('./routes/toughtsRoutes')
const authRoutes = require('./routes/authRoutes')


//controller
const ToughtsController = require('./controllers/ToughtsController')

//template engine
app.engine('handlebars', exphbs.engine())
app.set('view engine', 'handlebars')

//receber resposta do body
app.use(express.urlencoded({extended: true}))
app.use(express.json())


app.use(express.static(path.join(__dirname, 'public')))

//session middleware
app.use(session({
    name:'session',
    secret: 'nosso_secret',
    resave: false,
    saveUninitialized: false,
    store: new FileStore({
        logFn: function(){},
        path: path.join(require('os').tmpdir(), 'sessions')
    }),
    cookie:{
        secure: false,
        maxAge: 3600000,
        expires: new Date(Date.now() + 3600000),
        httpOnly: true

        
    }
}))

//flash messages
app.use(flash())

//set session to res

app.use((req, res, next)=> {
    if(req.session.userid){
        res.locals.session = req.session
    }

    next()
})


app.use('/toughts', toughtsRoutes)
app.use('/', authRoutes)

app.get('/', ToughtsController.showToughts)





conn.sync().then(()=> {
    
    app.listen(3000, ()=>{
        console.log('Server Running...')
    })
})


.catch(err => console.log(err))

