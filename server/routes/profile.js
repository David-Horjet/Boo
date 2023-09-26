'use strict';

const express = require('express');
const Profile = require('../models/Profile');
const router = express.Router();

const profiles = [
  {
    "id": 1,
    "name": "A Martinez",
    "description": "Adolph Larrue Martinez III.",
    "mbti": "ISFJ",
    "enneagram": "9w3",
    "variant": "sp/so",
    "tritype": 725,
    "socionics": "SEE",
    "sloan": "RCOEN",
    "psyche": "FEVL",
    "image": "https://soulverse.boo.world/images/1.png",
  }
];

module.exports = function() {

  router.get('/*', function(req, res, next) {
    res.render('profile_template', {
      profile: profiles[0],
    });
  });

  // Create a profile
  router.post('/profiles', async (req, res) => {
    const bodyData = req.body;
    try {
      const profile = new Profile(bodyData);
      await profile.save();
      res.redirect(`/profiles/${profile._id}`);
    } catch (error) {
      console.error(error);
      res.status(500).send('Server Error');
    }
  });

  // Get a profile by ID
  router.get('/profiles/:id', async (req, res) => {
    try {
      const profile = await Profile.findById(req.params.id);
      if (!profile) {
        return res.status(404).send('Profile not found');
      }
      res.render('profile', { profile });
    } catch (error) {
      console.error(error);
      res.status(500).send('Server Error');
    }
  });


  return router;
}

