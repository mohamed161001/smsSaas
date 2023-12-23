const Campaign = require('../models/campaignModel');
const mongoose = require('mongoose');
const validator = require('validator');
const axios = require('axios');
const User = require('../models/user');
const Contact = require('../models/contactModel');
const Group = require('../models/groupModel');
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


//::::::::::::::::::::: function to generate token for sms ::::::::::::::::::::::::::::::::::::::::::::::::::::::
const genToken = async (userToken) => {
  try {
      const response = await axios.post(
          'https://api.orange.com/oauth/v3/token',
          {
              grant_type: 'client_credentials'
          },
          {
              headers: {
                  Authorization: userToken,
                  Accept: 'application/json',
                  'content-type': 'application/x-www-form-urlencoded'
              }
          }
      );

      return response.data.access_token;
  } catch (error) {
      if (error.response && error.response.status === 401) {
          console.error('Invalid credentials provided for token generation');
          throw new Error('Veuillez vérifier vos identifiants SMS');
      } 
      else {
          console.error('Error generating token:', error.message);
          throw new Error('Failed to generate token');
      }
  }
};
// ::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::

//::::::::::::::::::::::: function to send sms that is called in createCampaign ::::::::::::::::::::::::::::::
const sendSMS = async (user, recipientsData, message) => {
    try {
      const token = await genToken(user.smsToken);
      const devPhoneNumber = user.smsNumberDev;
      const smsResponses = [];
  
      for (const recipientData of recipientsData) {
        const recipient = recipientData.phoneNumber;
        const firstName = recipientData.firstName;
  
        const processedMessage = message.replace("{{firstName}}", firstName);
  
        // Construct the URL and message for each recipient
        const url = `https://api.orange.com/smsmessaging/v1/outbound/tel%3A%2B${devPhoneNumber}/requests`;
  
        const messageBody = {
          outboundSMSMessageRequest: {
            address: `tel:+216${recipient}`,
            senderAddress: `tel:+${devPhoneNumber}`,
            outboundSMSTextMessage: {
              message: processedMessage,
            },
          },
        };
  
        try {
          // Send the SMS for each recipient
          const response = await axios.post(url, messageBody, {
            headers: {
              Authorization: `Bearer ${token}`,
              Accept: "application/json",
            },
          });
  
          // Store the response for this SMS
          smsResponses.push(response.data);
  
        } catch (error) {
          // if the error code is 403 return an error in French
          if (error.response && error.response.status === 403) {
            throw new Error('Votre crédit SMS est épuisé veuillez recharger votre compte');
          }
          // Handle other errors as needed
        }
      }
  
      return smsResponses;
    } catch (error) {
      throw error; // Propagate the error up to the caller
    }
  };
// ::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::


//create campaign
const createCampaign = async (req,res)=> {

    const campaignData = req.body;

    try {

    // Retrieve user data for SMS sending
    const userId = campaignData.recipientsData.userId;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: 'Utilisateur introuvable' });
    }

    if (!user.smsToken || !user.smsNumberDev) {
        return res.status(404).json({ error: 'veuillez ajouter un numéro de téléphone et un token dans la configuration des SMS'});
    }

   // ************************************************************************************************************
    // // the campaign data has the id of the group , get the contacts of the group which will be the recipients of the campaign
    // const groupId = campaignData.recipientsData.groupId;
    // const recipientsData = await Contact.find({ group: { $in: [groupId] } });

    // // if the group has no contacts return an error
    // if (!recipientsData.length) {
    //     return res.status(404).json({ error: 'Le groupe sélectionné ne contient aucun contact' });
    // }
  // ************************************************************************************************************  


        const smsResponses = await sendSMS(user,campaignData.recipientsData.recipientsData , campaignData.recipientsData.message);

        res.status(200).json({ smsResponses });

    } catch (error) {
        res.status(400).json({ error : error.message })
    }
}




module.exports = {
    getCampaigns,
    getCampaign,
    createCampaign,
}