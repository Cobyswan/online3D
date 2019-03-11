const express =  require('express');
const massive = require('massive');
const bodyParser = require('body-parser');
const session = require('express-session');
const app = express();
const controller = require('./controller')
const aC = require('./authController')
require('dotenv').config();
const nodemailer = require('nodemailer')
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY)

app.use( express.static( `${__dirname}/../build` ) );


app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

app.use(session({
    secret: process.env.SESSION_SECRET,
    saveUninitialized: false,
    resave: false
}))


massive(process.env.CONNECTION_STRING).then(db => {
    app.set('db', db)
    console.log('Connected to db')
})


app.post("/api/payment", (req, res) => {
    const stripeToken = req.body;
    console.log(stripeToken, 'stripe token')
    stripe.charges.create({
        amount: 100,
        currency: 'usd',
        description: 'Example Charge',
        source: stripeToken.body
      }, function(err, charge) {
          console.log('charge', charge)
          if(err){
            res.send({
                success: false,
                message: 'Error'
            })
          } else {
            res.send({
            success: true,
            message: 'Success'
         })
          }
      });
   
   })

app.post('/api/form', (req, res) => {
    nodemailer.createTestAccount((err, account) => {
        const htmlEmail =  `
        <h3>Contact Details</h3>
        <ul>
        <li> First Name: ${req.body.firstName} </li>
        <li> Last Name: ${req.body.lastName} </li>
        <li> Email: ${req.body.email} </li>
        </ul>
        <h3>Message</h3>
        <p>${req.body.message}</p>
        `

        let transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 465,
            secure: true,
            auth: {
                user: process.env.NODEMAILER_EMAIL,
                pass: process.env.NODEMAILER_PASS
            }
        })

        let mailOptions = {
            from: req.body.email,
            to: 'cobyashi21@gmail.com',
            replyTo: req.body.email,
            subject: 'New Message',
            text: req.body.message,
            html: htmlEmail
        }

        transporter.sendMail(mailOptions, (err, info) => {
            if(err) {
                res.status(500).send('Error')
            }
            console.log('MEssage sent: %s', info.message )
            console.log('Message Url: %s', nodemailer.getTestMessageUrl(info))
        })
        
        
    })
    res.status(200).send('Confirmed')
})

app.get('/api/cube_presets/:user_id', controller.getCubePresets)
app.get('/api/sphere_presets', controller.getSpherePresets)
app.get('/api/cone_presets', controller.getConePresets)
app.get('/api/preset_json/:preset_name', controller.getPresetJson)
app.post('/api/preset', controller.createPreset)
app.put('/api/preset/:preset_id', controller.updatePreset) //
app.delete('/api/cube_preset/:id', controller.deleteCubePreset)
app.delete('/api/sphere_preset/:id', controller.deleteSpherePreset)
app.delete('/api/cone_preset/:id', controller.deleteConePreset)
app.get('/api/user_data', aC.getUserData)
app.get('/auth', aC.login)
app.get('/api/logout', aC.logout)


const path = require('path')
app.get('*', (req, res)=>{
  res.sendFile(path.join(__dirname, '../build/index.html'));
})
port = process.env.PORT || 4000
app.listen(port, () => console.log(`Server is listening on port ${port}`))