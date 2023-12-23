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
            firstName: { $regex: new RegExp(search, 'i') }, // Search by first name
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
      // return the name and the id of the group
      const contactWithGroup = await Contact.findById(id).populate('group', 'name');
      
      res.status(200).json( contactWithGroup );
    } catch (error) {
      res.status(400).json({ error: error.message });
    }  
  };

// create a contact
const createContact = async (req, res) => {
    const {
      firstName,
      phoneNumber,
      group,
      client,
    } = req.body;

    // if the phoneNumber exists in the database, return an error
    const exists = await Contact.exists({ phoneNumber });
    if (exists) {
      return res.status(400).json({ error: 'Ce numéro existe déjà' });
    }
    try {

      const contact = await Contact.create({
        firstName,
        phoneNumber,
        group,
        client,
      });
        
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
    phoneNumber,
    group,
    client,
  } = req.body;
  // make sure that firstName, phoneNumber, group, client are not empty
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: 'Contact inexistant' });
  }

  if (!firstName || !phoneNumber || group.length === 0) {
    return res.status(400).json({ error: 'Veuillez remplir tous les champs' });
  }
  // if the phoneNumber exists in the database besides the current contact, return an error
  const exists = await Contact.exists({ phoneNumber, _id: { $ne: id } });
  if (exists) {
    return res.status(400).json({ error: 'Ce numéro existe déjà' });
  }
    
  try {
    const contact = await Contact.findById(id);
    if (!contact) {
      return res.status(404).json({ error: 'Contact inexistant' });
    }
    const updatedContact = await Contact.findByIdAndUpdate(id, {
      firstName,
      phoneNumber,
      group,
      client,
    }, { new: true });

    res.status(200).json({ updatedContact });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};


// create multiple contacts
const createContacts = async (req, res) => {
  const { client, contacts } = req.body;
  try {
    // only insert the contacts that their phoneNumber does not exist in the database
    const contactsToInsert = await Promise.all(
      contacts.map(async (contact) => {
        const exists = await Contact.exists({ phoneNumber: contact.phoneNumber });
        return exists ? null : { ...contact, client }; // Add the client field
      })
    );

    // Filter out null values from the array (contacts that already exist)
    const filteredContactsToInsert = contactsToInsert.filter(contact => contact !== null);

    if (filteredContactsToInsert.length === 0) {
      return res.status(200).json({ message: "0 contacts créés" });
    }

    const createdContacts = await Contact.insertMany(filteredContactsToInsert);

    // return a message with the number of created contacts
    res.status(200).json({ message: `${createdContacts.length} contacts créés` });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

//get group contacts
const getGroupContacts = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: 'Group inexistant' });
  }

  try {
    const group = await Group.findById(id);

    if (!group) {
      return res.status(404).json({ error: 'Group inexistant' });
    }

      const contacts = await Contact.find({ group: { $in: [id] } });

    res.status(200).json({ contacts });
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
    createContacts,
    getGroupContacts,
};

