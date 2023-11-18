const express = require ('express')
const {
    getGroups,
    getGroup,
    createGroup,
    updateGroup,
    deleteGroup
} = require('../controllers/groupController')
const router = express.Router()


// get all groups
router.get('/',getGroups)
// get one group
router.get('/:id',getGroup)
// create a group
router.post('/',createGroup)
// // update a group
router.patch('/:id',updateGroup)
// delete a Group
router.delete('/:id',deleteGroup)

module.exports = router