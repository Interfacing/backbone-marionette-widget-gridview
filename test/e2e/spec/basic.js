/*var webdriver = require('selenium-webdriver');

var sauce = 'http://ondemand.saucelabs.com:80/wd/hub';
var driver = new webdriver.Builder().
    usingServer(sauce).
    withCapabilities({
      browserName: 'Chrome',
      platform: 'Windows 2012',
      name: 'Sample selenium-webdriver test',
      username: 'fred_faust',//process.env.SAUCE_USERNAME,
      accessKey: 'd8a636fd-f111-4f51-bd87-60ef196b888e'//process.env.SAUCE_ACCESS_KEY
    }).
    build();

driver.get('http://www.google.com');
driver.findElement(webdriver.By.name('q')).sendKeys('webdriver');
driver.findElement(webdriver.By.name('btnG')).click();
driver.wait(function() {
  return driver.getTitle().then(function(title) {
    return title === 'webdriver - Google Search';
  });
}, 1000);

driver.quit();*/