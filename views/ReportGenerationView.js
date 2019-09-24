const puppeteer = require('puppeteer');
const moment = require('moment');

let responseHtml = '';

//Function to parse a string to html

// eslint-disable-next-line no-extend-native
String.prototype.deentitize = function() {
  let ret = this.replace(/&gt;/g, '>');
  ret = ret.replace(/&lt;/g, '<');
  ret = ret.replace(/&quot;/g, '"');
  ret = ret.replace(/&apos;/g, "'");
  ret = ret.replace(/&amp;/g, '&');
  return ret;
};

exports.getResourceStatsByHTML = async function(req, res, next) {
  responseHtml = req.body.html;
  res.status(200).json({
    status: 'success',
    data: null
  });
};

exports.getResourceHtml = async function(req, res, next) {
  const browser = await puppeteer.launch();
  const htmlPage = await browser.newPage();

  //get title
  let titleIn = req.params.textReport.split('-')[0];
  titleIn = titleIn.charAt(0).toUpperCase() + titleIn.slice(1); //set first letter as capital

  //check if the title is article to convert to announcements and news
  if (titleIn === 'Article') {
    titleIn = 'Announcements & New';
  }

  //get moment date
  const creationDate = moment().format('DD/MMM/YYYY HH:mm');

  //get the table stats from the html
  const tableStats = responseHtml.deentitize();

  const content = `<div class="d-flex"><h2>${titleIn}s Statistics</h2><h3 class="ml-auto">Created on ${creationDate}</h3></div><br/>${tableStats}`;

  await htmlPage.setContent(content);

  await htmlPage.addStyleTag({
    path: 'public/css/sb-admin.css'
  });

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

  res.type('application/pdf');
  res.send(buffer);
  browser.close();
};
