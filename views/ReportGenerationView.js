const puppeteer = require('puppeteer');

exports.getResourceStatsByTableId = async function(req, res, next) {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  await page.goto('http://127.0.0.1:8000/');

  await page.type('#inputEmail', process.env.PDF_USER);
  await page.type('#inputPassword', process.env.PDF_PASSWORD);

  await Promise.all([
    await page.click('#submitLogin'),
    page.waitForNavigation({ waitUntil: 'networkidle0' })
  ]);

  const page2 = await browser.newPage();

  await page2.goto('http://127.0.0.1:8000/statistics', {
    waitUntil: 'networkidle0'
  });

  const table = await page2.$eval(`#${req.params.tableId}`, e => {
    return e.innerHTML;
  });
  // console.log(table);

  page2.setContent(table);
  page2.addStyleTag({
    path: 'public/css/sb-admin.css'
  });

  const buffer = await page2.pdf({ format: 'A4' });

  res.type('application/pdf');
  res.send(buffer);
  browser.close();
};
