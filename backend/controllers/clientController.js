const User = require('../models/user');
const mongoose = require('mongoose');

const getClients = async (req, res) => {
  try {
    const { page = 0, pageSize = 10, sort = null, search = "" } = req.query;

    const generateSort = () => {
      const sortParsed = JSON.parse(sort);
      const sortFormatted = {
        [sortParsed.field]: sortParsed.sort === 'asc' ? 1 : -1,
      };
      return sortFormatted;
    };
    const sortFormatted = Boolean(sort) ? generateSort() : { createdAt: -1, _id: -1 };

    const clientsQuery = {
      $or: [
        { firstName: { $regex: new RegExp(search) } },
        { phoneNumber: { $regex: new RegExp(search) } },
        { email: { $regex: new RegExp(search) } },
      ],
      role: 'user',
    };

    const clients = await User.find(clientsQuery)
      .populate({
        path: 'payments',
        select: 'date',
        options: { sort: { date: -1, _id: -1 }, limit: 1 },
      })
      .sort(sortFormatted)
      .skip(page * pageSize)
      .limit(pageSize * 1);

    const totalClients = await User.countDocuments(clientsQuery);

    res.status(200).json({ clients, totalClients });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getClient = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: 'Client inexistant' });
  }

  try {
    const client = await User.findById(id);

    if (!client) {
      return res.status(404).json({ error: 'Client inexistant' });
    }

    res.status(200).json(client);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const updateClient = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: 'Client inexistant' });
  }

  try {
    const client = await User.findById(id);
    if (!client) return res.status(404).json({ error: 'Client inexistant' });
    await client.updateOne(req.body);
    if (req.body.status) {
      var result = await User.updateMany(
        { role: "staff", client: client._id },
        { $set: { status: req.body.status } }
      );
    }
    const matched = result?.matchedCount;
    const modified = result?.modifiedCount;
    res.status(200).json({ client, matched, modified });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const deleteClient = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: 'Client inexistant' });
  }
  try {
    const client = await User.findByIdAndDelete(id);
    if (!client) {
      return res.status(404).json({ error: 'Client inexistant' });
    }

    await User.findByIdAndDelete({ client: client._id });

    res.status(200).json({ client });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = {
  getClients,
  getClient,
  updateClient,
  deleteClient,
};
