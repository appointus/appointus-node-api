const router = require('express').Router()
const Client = require('../models/clients')
const clientController = require('../controllers').clientController

router.put('/clients/:id', function (req, res) {
  // if (Object.keys(req.body).length === 0) res.status(500).send('Error');
  const newClients = {}
  const allowedProps = ['first_name', 'last_name', 'phone']
  allowedProps.forEach(prop => {
    if (req.body.hasOwnProperty(prop)) newClients[prop] = req.body[prop]
  })

  Client.findOneAndUpdate(
    { _id: req.params.id },
    {
      $set: newClients
    },
    { new: true },
    function (err, doc) {
      if (err) console.log(err)
      res.send(doc)
    }
  )
})

router.put('/clients/:id/activate', function (req, res) {
  Client.findOneAndUpdate(
    { _id: req.params.id },
    { $set: { isActive: true } },
    { new: true },
    function (err, doc) {
      if (err) console.log(err)
      res.send(doc)
    }
  )
})

router.put('/clients/:id/deactivate', function (req, res) {
  Client.findOneAndUpdate(
    { _id: req.params.id },
    { $set: { isActive: false } },
    { new: true },
    function (err, doc) {
      if (err) console.log(err)
      res.send(doc)
    }
  )
})

router.get('/clients', function (req, res) {
  Client.find({ isActive: true }, function (err, clients) {
    if (err) return console.error(err)
    res.send(clients)
  })
})

router.get('/clients/all', function (req, res) {
  Client.find({}, function (err, clients) {
    if (err) return console.error(err)
    res.send(clients)
  })
})

router.post('/clients', function (req, res) {
  const clientToAdd = new Client({
    first_name: req.body.first_name,
    last_name: req.body.last_name,
    phone: req.body.phone
  })
  clientToAdd.save(function (err, client) {
    if (err) console.log('Error on save!')
    res.send(client)
  })
})

router.post('/clients/signup', async (req, res) => {
  try {
    let user = await clientController.signup.signup(req.body)
    res.status(user.status).json(user)
  } catch (error) {
    res.status(400).json({ message: 'Something went wong (' + error })
  }
})

router.post('/clients/login', async (req, res) => {
  try {
    let userModel = await clientController.login.login(req.body)
    res.status(userModel.status).json(userModel)
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong :(((' })
  }
})
module.exports = router
