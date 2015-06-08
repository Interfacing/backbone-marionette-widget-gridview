exports.config = {
  seleniumAddress: 'http://ondemand.saucelabs.com:80/wd/hub',//'http://localhost:4444/wd/hub',
  specs: [__dirname + '/spec/**/*.js'],
  multiCapabilities: [{
    browserName: 'Chrome',
    platform: 'Windows 2012',
    name: 'TreeView local e2e tests',
    username: process.env.SAUCE_USERNAME,
    accessKey: process.env.SAUCE_ACCESS_KEY
  }]
}