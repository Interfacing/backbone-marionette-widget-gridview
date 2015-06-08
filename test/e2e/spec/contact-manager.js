// IP of your website, obviously your IE VM doesn't know 'localhost'
var IP_SITE = 'localhost';

describe('Contact Manager', function() {

  beforeEach(function () {
    browser.driver.ignoreSynchronization = true;
  });

  afterEach(function() {

  });

  it('Add contact', function() {
    /*browser.driver.get('http://www.google.com');
    browser.driver.findElement(by.name('q')).sendKeys('webdriver');
    browser.driver.findElement(by.name('btnG')).click();
    browser.driver.wait(function() {
      return browser.driver.getTitle().then(function(title) {
        return title === 'webdriver - Google Search';
      });
    }, 1000);
    expect(1).toEqual(1);*/

    browser.driver.get('http://' + IP_SITE + ':8000/example/basic/index.html');

    browser.driver.findElement(by.css('.icon-expand')).click();
    browser.driver.sleep(3000);
    browser.driver.findElements(by.css('.icon-collapse:not(.hide)'))
      .then(function(elements) {
        expect(elements.length).toEqual(2)
      })
      .then(null, function(err) {
        console.log(err);
      });
  });

});