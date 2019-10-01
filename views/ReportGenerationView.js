// Node.js modules to use
const puppeteer = require('puppeteer');
const moment = require('moment');
// utilities to use
const AppError = require('./../utils/AppError');

//Variable to store the HTML response to generate the data
let responseHtml = '';

//Function to parse a string to HTML

// eslint-disable-next-line no-extend-native
String.prototype.deentitize = function() {
  let ret = this.replace(/&gt;/g, '>');
  ret = ret.replace(/&lt;/g, '<');
  ret = ret.replace(/&quot;/g, '"');
  ret = ret.replace(/&apos;/g, "'");
  ret = ret.replace(/&amp;/g, '&');
  return ret;
};

// get the statistics data HTML to be stored in the responseHTML variable
exports.getResourceStatsByHTML = async function(req, res, next) {
  try {
    //store the reponseHTML from the req.body
    responseHtml = req.body.html;
    res.status(200).json({
      status: 'success',
      data: null
    });
  } catch (err) {
    console.log(err);
    next(new AppError(err.message, err.statusCode));
  }
};

// get response HTML to send to the browser as PDF to be printed
exports.getResourceHtml = async function(req, res, next) {
  try {
    //open a browser puppeteer to launch the application
    const browser = await puppeteer.launch();
    //htmlPage to get page
    const htmlPage = await browser.newPage();

    //get text Report to generate to make the title in the PDF
    let titleIn = req.params.textReport.split('-')[0];
    titleIn = titleIn.charAt(0).toUpperCase() + titleIn.slice(1); //set first letter as capital

    //check if the title is article to convert to announcements and news
    if (titleIn === 'Article') {
      titleIn = 'Announcements & New';
    }

    //get moment PDF was created to be added it
    const creationDate = moment().format('DD/MMM/YYYY HH:mm');

    //get the table stats from the HTML and deentitize to convert from String to HTML
    const tableStats = responseHtml.deentitize();

    //create the content to add in the PDf from the title and table
    const content = `<div class="d-flex"><h2>${titleIn}s Statistics</h2><h3 class="ml-auto">Created on ${creationDate}</h3></div><br/>${tableStats}`;

    //set the new content in the htmlPage
    await htmlPage.setContent(content);

    //add style in the page to get the table with the required format
    await htmlPage.addStyleTag({
      path: 'public/css/sb-admin.css'
    });
    await htmlPage.addStyleTag({
      path: 'public/css/style.css'
    });

    //create a buffer object to lunch the htmlPage with the PDF specifications
    const buffer = await htmlPage.pdf({
      format: 'A4',
      margin: {
        top: '2.54cm',
        bottom: '2.54cm',
        left: '2.54cm',
        right: '2.54cm'
      },
      displayHeaderFooter: true
    });

    //set the response as PDF
    res.type('application/pdf');
    //send the buffer to the windows, so user can download it
    res.send(buffer);
    //close browser
    browser.close();
  } catch (err) {
    console.log(err);
    next(new AppError(err.message, err.statusCode));
  }
};
