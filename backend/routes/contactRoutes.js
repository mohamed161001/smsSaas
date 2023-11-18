const express = require ('express')
const {
    getContacts,
    getContact,
    createContact,
    deleteContact,
    updateContact,
} = require('../controllers/contactController')
const router = express.Router()


// get all contacts
router.get('/',getContacts)
// get one contact
router.get('/:id',getContact)
// create a contact
router.post('/',createContact)
// // update a contact
router.patch('/:id',updateContact)
// delete a contact
router.delete('/:id',deleteContact)

module.exports = router