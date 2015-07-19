var metalsmith = require('metalsmith'),
    markdown = require('metalsmith-markdown'),
    templates  = require('metalsmith-templates');


var siteBuild = metalsmith(__dirname)
  .metadata({
    site: {
      title: 'WikiLogic Docs',
      url: 'http://wikilogic.github.io/WikiLogic-0.3/'
    }
  })
  .source('./src')
  .destination('./build')
  // build plugins go here
  .use(markdown({
    smartypants: true,
    gfm: true,
    tables: true
  }))
  .use(templates('handlebars'))
  .build(function (err) {
    if (err) {
      console.log(err);
    }
    else {
      console.log('Site build complete!');
    }
  });