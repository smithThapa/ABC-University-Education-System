const puppeteer = require('puppeteer');

const AppError = require('./../utils/AppError');

const compile = async function(template, data) {};

exports.getReportGenerationView = async function(req, res, next) {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  //   await page.goto('http://127.0.0.1:8000/statistics', {
  //     waitUntil: 'networkidle0'
  //   });

  //   const cookies = [
  //     {
  //       name: 'jwt',
  //       value: req.cookies.jwt,
  //       httpOnly: true,
  //       expires:
  //         Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
  //     }
  //   ];
  //   await page.setCookie(...cookies);
  //   //   page.setExtraHTTPHeaders({ jwt: `${req.cookies.jwt}` });

  const buffer = await page.pdf({ format: 'A4' });

  res.type('application/pdf');
  res.send(buffer);
  browser.close();
};
