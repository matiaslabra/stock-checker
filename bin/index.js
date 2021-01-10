#!/usr/bin/env node

require('chromedriver');
const webdriver = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const chalk = require('chalk');
const sites = require('../sites.json');
const { checkSite } = require('../src/checkSite');

const checkStock = async () => {
  console.log(chalk.black.bgBlue('Prepping driver'));
  console.log(chalk.black.bgBlue(`Checking at ${new Date().toLocaleString()}`));
  const driver = new webdriver.Builder()
    .forBrowser('chrome')
    .setChromeOptions(new chrome.Options().headless())
    .withCapabilities(webdriver.Capabilities.chrome())
    .build();
  try {
    for (let index = 0; index < sites.length; index += 1) {
      // making it wait for each loop on purpose to let previous chrome tab finish
      await checkSite(sites[index], driver);
    }
  } finally {
    await driver.quit();
  }
};

(async function loop() {
  // initial call before loop
  checkStock();
  return new Promise((_, reject) => {
    const interval = setInterval(() => {
      checkStock()
        .catch((e) => {
          console.log('Error: ', e);
          clearInterval(interval);
          reject(Error(e));
        });
      // keep on waiting
    }, 1000 * 60 * 10); // 10 minutes
  });
}());
