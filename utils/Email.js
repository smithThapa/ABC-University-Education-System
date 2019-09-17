const nodemailer = require('nodemailer');
const pug = require('pug');
const htmlToText = require('html-to-text');

// new Email(user, url).sendWelcome();

module.exports = class Email {
  constructor(user, url) {
    this.to = user.email;
    this.firstName = user.firstName;
    this.lastName = user.lastName;
    this.url = url;
    this.from = `ABC Univeristy Edication System <${process.env.EMAIL_FROM}>`;
  }

  newTransport() {
    if (process.env.NODE_ENV.trim() === 'production') {
      return nodemailer.createTransport({
        service: 'SendGrid',
        auth: {
          user: process.env.SENDGRID_USERNAME,
          pass: process.env.SENDGRID_PASSWORD
        }
      });
    }

    return nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD
      }
    });
  }

  async send(template, subject) {
    // render html on a pug templare
    const html = pug.renderFile(
      `${__dirname}/../views/emails/${template}.pug`,
      {
        firstName: this.firstName,
        lastName: this.lastName,
        url: this.url,
        subject
      }
    );

    //DEfine email mailOptions
    const mailOptions = {
      from: this.from,
      to: this.to,
      subject,
      html,
      text: htmlToText.fromString(html)
    };

    // create transport and email

    await this.newTransport().sendMail(mailOptions);
  }

  async sendWithBody(template, subject, data) {
    // render html on a pug templare
    const html = pug.renderFile(
      `${__dirname}/../views/emails/${template}.pug`,
      {
        firstName: this.firstName,
        lastName: this.lastName,
        url: this.url,
        subject,
        data
      }
    );

    //DEfine email mailOptions
    const mailOptions = {
      from: this.from,
      to: this.to,
      subject,
      html,
      text: htmlToText.fromString(html)
    };

    // create transport and email
    await this.newTransport().sendMail(mailOptions);
  }

  async sendWelcome() {
    await this.send('welcome', 'Welcome to the ABC University');
  }

  async sendPasswordReset() {
    await this.send('passwordReset', 'Your new password reset token');
  }

  async sendAnnouncement(data) {
    await this.sendWithBody(
      'announcementNotification',
      `New Announcement from ABC University: ${data.title}`,
      data.description
    );
  }

  async sendNotificationChangePassword() {
    await this.send(
      'changePassword',
      'You have not changed your password in more than 2 months'
    );
  }

  async sendNotificationEmailNotification(data) {
    await this.sendWithBody('emailNotification', data.subject, data);
  }

  async sendMaintenanceResolution(data) {
    await this.sendWithBody(
      'maintenanceResolutionEmail',
      `Your Request has been ${data.status}: ${data.subject}`,
      data
    );
  }
};
