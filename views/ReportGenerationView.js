const puppeteer = require('puppeteer');
const moment = require('moment');

exports.getResourceGenerationView = function(req, res) {
  res
    .status(200)
    .render('ReportGenerationView', { title: 'Report Generation' });
};

exports.getResourceStatsByTableId = async function(req, res, next) {
  const browser = await puppeteer.launch();
  const loginPage = await browser.newPage();

  await loginPage.goto('http://127.0.0.1:8000/');

  await loginPage.type('#inputEmail', process.env.PDF_USER);
  await loginPage.type('#inputPassword', process.env.PDF_PASSWORD);

  await Promise.all([
    await loginPage.click('#submitLogin'),
    loginPage.waitForNavigation({ waitUntil: 'networkidle0' })
  ]);

  const statsPage = await browser.newPage();

  await statsPage.goto('http://127.0.0.1:8000/statistics', {
    waitUntil: 'networkidle0'
  });

  const tableStats = await statsPage.$eval(
    `#${req.params.tableId}-table`,
    e => {
      return e.innerHTML;
    }
  );

  let cardStats = '<div class="card-deck"><div class="card">';
  if (req.params.tableId !== 'article-statistics') {
    cardStats += await statsPage.$eval(`#${req.params.tableId}-card`, e => {
      return e.innerHTML;
    });
    cardStats += '</div><div class="card bg-transparent border-0"></div>';
    cardStats += '<div class="card bg-transparent border-0"></div>';

    cardStats += '</div>';
  } else {
    cardStats += await statsPage.$eval(`#announcement-statistics-card`, e => {
      return e.innerHTML;
    });

    cardStats += '</div> <div class="card">';

    cardStats += await statsPage.$eval(`#new-statistics-card`, e => {
      return e.innerHTML;
    });

    cardStats += '</div><div class="card bg-transparent border-0"></div>';

    cardStats += '</div>';
  }
  // console.log(cardStats);

  //get title
  let titleIn = req.params.tableId.split('-')[0];
  titleIn = titleIn.charAt(0).toUpperCase() + titleIn.slice(1);

  const creationDate = moment().format('DD/MMM/YYYY HH:mm');

  const content = `<div class="d-flex"><h2>${titleIn}s Statistics - Table</h2><h3 class="ml-auto">Created on ${creationDate}</h3></div><br/>${cardStats}<br/><br/>${tableStats}`;

  statsPage.setContent(content);

  // statsPage.setContent(table);
  statsPage.addStyleTag({
    path: 'public/css/sb-admin.css'
  });

  const buffer = await statsPage.pdf({
    // path: `${req.params.tableId}`,
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

exports.getResourceStatsByHTML = async function(req, res, next) {
  const browser = await puppeteer.launch();
  const htmlPage = await browser.newPage();

  htmlPage.setContent(req.body.html);

  // const tableStats = req.body.html;

  // console.log(tableStats);

  // let cardStats = '<div class="card-deck"><div class="card">';
  // if (req.params.tableId !== 'article-statistics') {
  //   cardStats += await statsPage.$eval(`#${req.params.tableId}-card`, e => {
  //     return e.innerHTML;
  //   });
  //   cardStats += '</div><div class="card bg-transparent border-0"></div>';
  //   cardStats += '<div class="card bg-transparent border-0"></div>';

  //   cardStats += '</div>';
  // } else {
  //   cardStats += await statsPage.$eval(`#announcement-statistics-card`, e => {
  //     return e.innerHTML;
  //   });

  //   cardStats += '</div> <div class="card">';

  //   cardStats += await statsPage.$eval(`#new-statistics-card`, e => {
  //     return e.innerHTML;
  //   });

  //   cardStats += '</div><div class="card bg-transparent border-0"></div>';

  //   cardStats += '</div>';
  // }
  // // console.log(cardStats);

  // //get title
  // let titleIn = req.params.tableId.split('-')[0];
  // titleIn = titleIn.charAt(0).toUpperCase() + titleIn.slice(1);

  // const creationDate = moment().format('DD/MMM/YYYY HH:mm');

  // const content = `<div class="d-flex"><h2>${titleIn}s Statistics - Table</h2><h3 class="ml-auto">Created on ${creationDate}</h3></div><br/>${cardStats}<br/><br/>${tableStats}`;

  // statsPage.setContent(content);

  // // statsPage.setContent(table);
  htmlPage.addStyleTag({
    path: 'public/css/sb-admin.css'
  });

  const buffer = await htmlPage.pdf({
    // path: `${req.params.tableId}`,
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
