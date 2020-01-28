const Convention = require("../models/Conventions");

exports.userCreatorController = {

  async getConvention(req, res) {
    try {
      const convention = await Convention.find({ title: req.params.title });
      //Simple check to verify if there is a convention with this title
      if (convention.length !== 0) {
        res.status(200).json(convention);
      } else res.status(400).send(`${req.params.title} is not in the system`);
    } catch (err) {
      res.status(500).send(`${err}`);
    }
  },

  async getConventions(req, res) {
    try {
      const conventions = await Convention.find({conventionCreator: req.params.name});
      if (conventions.length !== 0) {
        res.status(200).send(conventions);
      } else res.status(400).send(`${req.params.name} is not in the system`);
    } catch (err) {
      res.status(500).send(`${err}`);
    }
  },

  async createConvention(req, res) {
    try {
      const convention = await Convention.conventionExist(
        req.body.start,
        req.body.end,
        req.body.location
      );
      if (convention.length !== 0) {
        throw new Error(`A convention is already exist in this date and location,
           please choose another date/location`);
      }

      const newConvention = new Convention({
        title: req.body.title,
        category: req.body.category,
        start: req.body.start,
        end: req.body.end,
        description: req.body.description,
        location: req.body.location,
        price: req.body.price,
        lecturerProfile: req.body.lecturerProfile,
        conventionCreator: `${req.body.lecturerProfile.firstName} ${req.body.lecturerProfile.lastName}`
      });

      await newConvention.save(err => {
        if (err) return res.status(500).send(`Server Error: ${err}`);
        res.status(200).json(newConvention);
      });
    } catch (err) {
      res.status(500).send(`${err}`);
    }
  },

  async editConvention(req, res) {
    try {
      //Check if date & location has been changed by the user
      const checkDate = await Convention.find({ _id: req.params.id });

      if (
        checkDate.start !== req.body.start ||
        checkDate.end !== req.body.end ||
        checkDate.location !== req.body.location
      ) {
        //If date & location has been changed - the system should check whether it is valid or not
        const convention = await Convention.conventionExist(req.body.start,req.body.end,req.body.location);
        if (convention.length !== 0) {
          throw new Error(`Convention is already exist in this date and location,please choose another date/location`);
        }
      }
      //Update a convention with new values
      const newConvention = {
        title: req.body.title,
        category: req.body.category,
        start: req.body.start,
        end: req.body.end,
        description: req.body.description,
        location: req.body.location,
        price: req.body.price,
        lecturerProfile: req.body.lecturerProfile,
        conventionCreator: `${req.body.lecturerProfile.firstName} ${req.body.lecturerProfile.lastName}`
      };

      await Convention.updateOne(
        { _id: req.params.id },
        { $set: newConvention }
      )
        .then(() => {
          res.status(200).json(newConvention);
        })
        .catch(err => {
          res.status(400).send(`Failed to update convention: ${err}`);
        });
    } catch (err) {
      res.status(500).send(`${err}`);
    }
  },

  async deleteConvention(req, res) {

    try {
      const convention = await Convention.findOne({ _id: req.params.id });
      if (convention !== null) {
        await Convention.deleteOne({ _id: req.params.id })
          .then(() =>
            res.status(200).send(`${convention.title} has been removed from the system`)
          )
          .catch(err => res.status(500).send(`Server error: ${err}`));
      }
      res.status(400).send(`${req.params.id} is not in the system - Could not be removed`);
    } catch (err) {
      res.status(500).send(`${err}`);
    }
  }
};
