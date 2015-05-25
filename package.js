Package.describe({
  name: 'lukemadera:subpages',
  version: '0.0.1',
  // Brief, one-line summary of the package.
  summary: 'Steps / Wizard for combining multiple pages / templates into a series of sub pages',
  // URL to the Git repository containing the source code for this package.
  git: '',
  // By default, Meteor will default to using README.md for documentation.
  // To avoid submitting documentation, set this field to null.
  documentation: 'README.md'
});

Package.onUse(function(api) {
  api.versionsFrom('1.1.0.2');

  api.use('templating@1.0.0');
  api.use('blaze@2.0.0');
  api.use('reactive-var@1.0.5');
  api.use('iron:router@1.0.7')

  api.addFiles([
    'subpages.html',
    // 'subpages.import.less',
    'subpages.js'
  ], 'client');

  api.export('lmSubpages');
});

Package.onTest(function(api) {
  api.use('tinytest');
  api.use('lukemadera:subpages');
  api.addFiles('subpages-tests.js');
});
