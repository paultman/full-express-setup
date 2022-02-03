// jsdoc.config.js

module.exports = {
  tags: {
    allowUnknownTags: true,
    dictionaries: ['jsdoc', 'closure'],
  },
  source: {
    include: ['controllers'],
    includePattern: '.+\\.js(doc|x)?$',
  },
  opts: {
    template: 'node_modules/docdash',
    destination: 'docs/',
    recurse: true,
    verbose: true,
  },
};
