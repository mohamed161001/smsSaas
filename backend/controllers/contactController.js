const Contact = require('../models/contactModel');
const Group = require('../models/groupModel');
const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');

//get all contacts
const getContacts = async (req, res) => {
    try {
      const {page = 0, pageSize = 10, sort = null, clientID ,  search=""} = req.query
  
      const generateSort = () => {   
        const sortParsed = JSON.parse(sort)
        const sortFormatted = {
          [sortParsed.field]: (sortParsed.sort = 'asc' ? 1 : -1)
        }
        return sortFormatted;
      }
      const sortFormatted = Boolean(sort) ? generateSort() : { createdAt: -1, _id: -1 }

      const contactsQuery = {
        client: clientID,
        $or: [
          {
            $or: [
              {
                fullName: { $regex: new RegExp(search, 'i') }, // Search by full name
              },
              {
                $expr: {
                  $regexMatch: {
                    input: {
                      $concat: ['$firstName', ' ', '$lastName'], // Concatenate firstName and lastName with a space
                    },
                    regex: new RegExp(search, 'i'),
                  },
                },
              },
            ],
          },
          { phoneNumber: { $regex: search, $options: 'i' } },
        ],
      }
  
      const contacts = await Contact.find(contactsQuery)
      .sort(sortFormatted)
      .skip(page * pageSize)
      .limit(pageSize * 1)
      // populate the group name if group is not null
      .populate('group', 'name')
  
      // count the total number of contacts
      const totalcontacts = await Contact.countDocuments(contactsQuery)
  
      res.status(200).json({contacts, totalcontacts});
    } catch (error){
      res.status(400).json({ error: error.message });
    }
  }

//get one contact
const getContact = async (req, res) => {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({ error: 'Contact inexistant' });
    }
  
    try {
      const contact = await Contact.findById(id);
  
      if (!contact) {
        return res.status(404).json({ error: 'Contact inexistant' });
      }
  
      res.status(200).json(contact);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }  
  };

// create a contact
const createContact = async (req, res) => {
    const {
      firstName,
      lastName,
      phoneNumber,
      group,
      client,
    } = req.body;
    try {

      const contact = await Contact.create({
        firstName,
        lastName,
        phoneNumber,
        group,
        client,
      });

     //push contact to group
      // if (req.body.group) {
      //   const group = await Group.findById(req.body.group);
      //   group.contacts.push(contact._id);
      //   await group.save();
      // }
        
      res.status(200).json({ contact });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  };

// delete a contact
const deleteContact = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: 'Contact inexistant' });
  }
  try {
    const contact = await Contact.findByIdAndDelete(id);
    if (!contact) {
      return res.status(404).json({ error: 'Contact inexistant' });
    }
    
    res.status(200).json({contact});
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// update a contact
const updateContact = async (req, res) => {
  const { id } = req.params;
  const {
    firstName,
    lastName,
    phoneNumber,
    group,
    client,
  } = req.body;
  // make sure that firstName, lastName, phoneNumber, group, client are not empty
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: 'Contact inexistant' });
  }
  if (!firstName || !lastName || !phoneNumber) {
    return res.status(400).json({ error: 'Veuillez remplir tous les champs' });
  }
  try {
    const contact = await Contact.findById(id);
    if (!contact) {
      return res.status(404).json({ error: 'Contact inexistant' });
    }
    const updatedContact = await Contact.findByIdAndUpdate(id, {
      firstName,
      lastName,
      phoneNumber,
      group,
      client,
    }, { new: true });

    res.status(200).json({ updatedContact });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};


module.exports = {
    getContacts,
    getContact,
    createContact,
    deleteContact,
    updateContact,
}