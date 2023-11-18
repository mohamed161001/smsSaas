const Group = require('../models/groupModel');
const Contact = require('../models/contactModel');
const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');

//get all groups
const getGroups = async (req, res) => {
  try {
    const { page = 0, pageSize = 10, sort = null, clientID, search = "" } = req.query;

    const generateSort = () => {
      const sortParsed = JSON.parse(sort);
      const sortFormatted = {
        [sortParsed.field]: sortParsed.sort === 'asc' ? 1 : -1,
      };
      return sortFormatted;
    };

    const sortFormatted = Boolean(sort) ? generateSort() : { createdAt: -1, _id: -1 };

    const groupsQuery = {
      client: clientID,
      $or: [
        { name: { $regex: search, $options: 'i' } },
      ],
    };

    const result = await Group.find(groupsQuery)
      .sort(sortFormatted)
      .skip(page * pageSize)
      .limit(pageSize * 1);

    // Create a simplified array of groups with the required data
    const groups = result.map((group) => ({
      _id: group._id,
      createdAt: group.createdAt,
      name: group.name,
      client: group.client,
    }));

    // Create an array of promises to get the number of contacts for each group
    const contactCountPromises = groups.map((group) => Contact.countDocuments({ group: group._id }));

    // Wait for all contact count promises to resolve
    const numberOfContacts = await Promise.all(contactCountPromises);

    // Combine the contact count with the group data
    groups.forEach((group, index) => {
      group.numberOfContacts = numberOfContacts[index];
    });

    // Count the total number of groups
    const totalgroups = await Group.countDocuments(groupsQuery);

    res.status(200).json({ groups, totalgroups });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

//get one group
const getGroup = async (req, res) => {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({ error: 'Group inexistant' });
    }
  
    try {
      const group = await Group.findById(id);
  
      if (!group) {
        return res.status(404).json({ error: 'Group inexistant' });
      }
  
      res.status(200).json(group);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }  
  };

// create a group
const createGroup = async (req, res) => {
    const {
      name,
      client,
    } = req.body;
    try {

      const group = await Group.create({
        name,
        client,
      });

      res.status(200).json({ group });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  };

// delete a group
const deleteGroup = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: 'Group inexistant' });
  }
  try {
    const group = await Group.findByIdAndDelete(id);

    if (!group) {
      return res.status(404).json({ error: 'Group inexistant' });
    }

    // delete all contacts in group
    await Contact.deleteMany({ group: id });

    res.status(200).json({group});
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// update a group
const updateGroup = async (req, res) => {
  const { id } = req.params;
  const {
    name,
    client,
  } = req.body;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: 'Group inexistant' });
  }
  if(!name){
    return res.status(404).json({ error: 'le nom du groupe est obligatoire' });
  }
  try {
    const group = await Group.findById(id);
    if (!group) {
      return res.status(404).json({ error: 'Group inexistant' });
    }
    const updatedGroup = await Group.findByIdAndUpdate(id, {
      name,
      client,
    }, { new: true });
    res.status(200).json({ updatedGroup });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};


module.exports = {
    getGroups,
    getGroup,
    createGroup,
    deleteGroup,
    updateGroup 
}