const Campaign = require('../models/campaignModel');
const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');

// get all campaigns
const getCampaigns = async (req, res) => {
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
  
      const campaignQuery = {
        client: clientID,
        $or: [
          { name: { $regex: search, $options: 'i' } },
        ],
      };
  
      const campaigns = await Campaign.find(campaignQuery)
        .sort(sortFormatted)
        .skip(page * pageSize)
        .limit(pageSize * 1);

      const totalcampaigns = await Campaign.countDocuments(campaignQuery);
  
      res.status(200).json({ campaigns, totalcampaigns });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  };


 // get one campaign
  const getCampaign = async (req,res)=> {

    const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(404).json({ error: 'Campagne inexistante' });
        }

    try {

        const campaign = await Campaign.findById(id);

        if(!campaign){
            return res.status(404).json({error : 'campagne inexistante'});
        }

        res.status(200).json(campaign);
        
    } catch (error) {
        res.status(400).json({ error : error.message })
    }
}




module.exports = {
    getCampaigns,
    getCampaign,
}