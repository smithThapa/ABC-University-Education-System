//Node.js modules to be implemenet
const nodemailer = require('nodemailer');
const pug = require('pug');
const htmlToText = require('html-to-text');

//Email class to create an email element and be send to one user
module.exports = class Email {
  //class constructor with the user to send the email and a URL to be attached in the email
  constructor(user, url) {
    //set the to element with the user email
    this.to = user.email;
    //set the first name with the user first name
    this.firstName = user.firstName;
    //set the last name with the user last name
    this.lastName = user.lastName;
    //set the url with the given URL
    this.url = url;
    //set the from value of the email
    this.from = `ABC Univeristy Edication System <${process.env.EMAIL_FROM}>`;
  }

  //method to create a new transporter to send the email
  newTransport() {
    //check if the application is running in production
    if (process.env.NODE_ENV.trim() === 'production') {
      //create the transporter with SendGrid
      return nodemailer.createTransport({
        service: 'SendGrid',
        //authentication values of the user to the the email
        auth: {
          user: process.env.SENDGRID_USERNAME,
          pass: process.env.SENDGRID_PASSWORD
        }
      });
    }

    //otherwise user Another Email Host with MailTRap
    return nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD
      }
    });
  }

  // sent method to send the email, which receive the templete to use and a subject to be attached to the email
  async send(template, subject) {
    // render html on a pug templare with the templace name
    const html = pug.renderFile(
      `${__dirname}/../views/emails/${template}.pug`,
      {
        //values to render in the pug file
        firstName: this.firstName,
        lastName: this.lastName,
        url: this.url,
        subject
      }
    );

    //define email option, such as from, to, subject, type and text
    const mailOptions = {
      from: this.from,
      to: this.to,
      subject,
      html,
      text: htmlToText.fromString(html)
    };

    //process the new transport and set the mail option into the email
    await this.newTransport().sendMail(mailOptions);
  }

  // sendWithBody method to send the email, which receive the templete to use and a subject to be attached to the email and extra data to be sent
  async sendWithBody(template, subject, data) {
    // render html on a pug templare with the templace name
    const html = pug.renderFile(
      `${__dirname}/../views/emails/${template}.pug`,
      {
        //values to render in the pug file, with the extra data
        firstName: this.firstName,
        lastName: this.lastName,
        url: this.url,
        subject,
        data
      }
    );

    //define email option, such as from, to, subject, type and text
    const mailOptions = {
      from: this.from,
      to: this.to,
      subject,
      html,
      text: htmlToText.fromString(html)
    };

    //process the new transport and set the mail option into the email
    await this.newTransport().sendMail(mailOptions);
  }

  // class method to send welcome email, setting the welcome templace and the subject
  async sendWelcome() {
    await this.send('welcome', 'Welcome to the ABC University');
  }

  // class method to send password reset email, setting the passwordReset templace and the subject
  async sendPasswordReset() {
    await this.send('passwordReset', 'Your new password reset token');
  }

  // class method to send announcement email, setting the announcementNotification templace and the subject, with the extra data for the announcement title and description
  async sendAnnouncement(data) {
    await this.sendWithBody(
      'announcementNotification',
      `New Announcement from ABC University: ${data.title}`,
      data.description
    );
  }

  // class method to send notification to change passsword email, setting the changePassword templace and the subject
  async sendNotificationChangePassword() {
    await this.send(
      'changePassword',
      'You have not changed your password in more than 2 months'
    );
  }

  // class method to send an email with a notification email, setting the emailNotification templace, the data subject and the data obejct
  async sendEmailNotification(data) {
    await this.sendWithBody('emailNotification', data.subject, data);
  }

  // class method to send maintenance resolution email, setting the maintenanceResolutionEmail templace and the subject, and the data
  async sendMaintenanceResolution(data) {
    await this.sendWithBody(
      'maintenanceResolutionEmail',
      `Your Request has been ${data.status}: ${data.subject}`,
      data
    );
  }
};
