const express = require ('express')
const {
    getClients,
    getClient,
    updateClient,
    deleteClient,
} = require('../controllers/clientController')
const router = express.Router()


// get all clients
router.get('/',getClients)
// get one client
router.get('/:id',getClient)
// update a client
router.patch('/:id',updateClient)
// delete a client
router.delete('/:id',deleteClient)

module.exports = router