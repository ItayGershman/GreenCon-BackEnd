const nodemailer = require("nodemailer");
const { writeFileSync } = require("fs");
const ics = require("ics");
// const convention = require("../controller/userController"); //get the new convention

module.exports = function sendEmail(convention) {
  //Convert attendees to array of Objects instead array of
  const attendees = convention.attendance.reduce((s, a) => {
    s.push({ name: a });
    return s;
  }, []);

  const attendLength = convention.attendance.length;

  //Create event
  ics.createEvent(
    {
      start: [
        convention.start.getFullYear(),
        convention.start.getMonth() + 1, // getMonth() - JAN = 0, FEB = 1
        convention.start.getDate(),
        convention.start.getHours(),
        convention.start.getMinutes()
      ],
      duration: {
        hours: convention.end.getHours() - convention.start.getHours(),
        minutes: convention.end.getMinutes() - convention.start.getMinutes()
      },
      title: convention.title,
      description: convention.description,
      location: convention.location,
      categories: [convention.category],
      status: "CONFIRMED",
      organizer: {name: convention.conventionCreator},
      attendees: attendees
    },
    (error, value) => {
      if (error) {
        console.error(error);
      }
      writeFileSync(`${__dirname}/event.ics`, value);
    }
  );

  //set transporter
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL,
      pass: process.env.PASSWORD
    },
    tls: {
      rejectUnauthorized: false
    }
  });

  //Set options
  const mailOptions = {
    from: process.env.EMAIL,
    to: convention.attendance[attendLength - 1],
    subject: `attendance to ${convention.title}`,
    text: convention.description,
    icalEvent: {
      method: "PUBLISH",
      path: `${__dirname}/event.ics`
    }
  };

  //Send email
  transporter
    .sendMail(mailOptions)
    .then(response => {
      console.log("MSG Sent");
      return;
    })
    .catch(err => {
      console.error(err);
    });
}
