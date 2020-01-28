const Convention = require("../models/Conventions");
const Tip = require("../models/Tips");
const fetch = require("node-fetch");
const sendEmail = require('./sendEvent');

exports.userController = {
  //get convention by title
  async getConvention(req, res) {
    try {
      const convention = await Convention.find({ title: req.params.title });
      if (convention.length !== 0) {
        res.status(200).json(convention);
      } else res.status(400).send(`${req.params.title} is not in the system`);
    } catch (err) {
      res.status(500).send(`${err}`);
    }
  },

  //get conventions the user attended to - by my name
  async getMyConventions(req, res) {
    try {
      const conventions = await Convention.find({attendance: req.params.name});
      if (conventions.length !== 0) {
        res.status(200).json(conventions);
      } else res.status(400).send(`You have no conventions you signed to`);
      res.status(200).json(conventions);
    } catch (err) {
      res.status(500).send(`${err}`);
    }
  },

  //Via Lusha API
  async getLecturerProfile(req, res) {
    try {
      const convention = await Convention.findOne({ _id: req.params.id });
      if (convention === null)
        return res.status(400).send(`${req.params.id} is not in the system`);
      const url = `https://api.lusha.co/person?firstName=${convention.lecturerProfile.firstName}&lastName=${convention.lecturerProfile.lastName}&company=${convention.lecturerProfile.company}`;
      const options = {
        headers: {
          api_key: "c6bd1fc7-92f5-433b-896d-45620a381af1"
        }
      };

      fetch(url, options)
        .then(res => res.json())
        .then(data => {
          if(data.data !== undefined){
              res.status(200).json(data.data.company);
          }
          else res.status(400).send(`Data on this lecturer is unavailable`);
        })
        .catch(err => {
          res.status(400).send(`${err}`);
        })
    } catch (err) {
      res.status(500).send(`${err}`);
    }
  },

  async postTip(req, res) {
    try {
      const tip = new Tip({
        content: req.body.content
      });
      await tip.save(err => {
        if (err) {
          res.status(500).send(`${err}`);
        } else res.status(200).json(tip);
      });
    } catch (err) {
      res.status(500).send(`${err}`);
    }
  },

  async attendConvention(req, res) {
    try {
      if (req.body.userID === undefined)
        return res.status(400).send(`Please enter your email address`);

      //Update attendees and then sendEmail to the attended user
      Convention.updateOne(
        { _id: req.params.id },
        { $push: { attendance: req.body.userID } }
      ).then(async () => {
        const convention = await Convention.findOne({ _id: req.params.id });
        sendEmail(convention);
        return res.status(200).json(convention);
      }).catch(err => console.error(err));
    } catch (err) {
      res.status(500).send(`${err}`);
    }
  },

  //Delete attendance from a convention
  async deleteConvention(req, res) {
    try {
      await Convention.updateOne(
        { _id: req.params.id },
        { $pull: { attendance: req.body.userID } }
      );
      res.status(200).send(`attendance was successfully removed`);
    } catch (err) {
      res.status(500).send(`${err}`);
    }
  }
};
