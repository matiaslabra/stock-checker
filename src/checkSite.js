const chalk = require('chalk');
const web = require('selenium-webdriver');
const { notify } = require('./notify');

function sleep(wait) {
  return new Promise((resolve) => setTimeout(resolve, wait * 1000));
}

const isMatch = (actual, expected) => {
  if (Array.isArray(expected)) return expected.includes(actual);
  return actual === expected;
};

const checkSite = async (site, driver) => {
  const {
    url, xPath, expected, wait = 1, description,
  } = site;
  await driver.get(url);
  await sleep(wait);
  try {
    const value = await driver.findElement(web.By.xpath(xPath)).getText();
    if (!isMatch(String(value), expected)) {
      console.log(chalk.black.bgGreen(description, '-', value, '-', url));
      await notify({ site, message: `${description} was expecting "${expected}" but got "${value}"` });
    } else {
      console.log(chalk.black.bgRed(description, '-', value, '-', url));
    }
  } catch (e) {
    console.log(chalk.black.bgCyan('Could not reach', url));
    await notify({ site, message: `${description} could not reach the node specified` });
  }
};

module.exports = {
  checkSite,
};
