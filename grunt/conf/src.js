
module.exports = {
  js: [
    'src/index.js',
    'src/services/**/*.js',
    'src/directives/**/*.js',
    '!src/**/*.spec.js'
  ],
  atpl: ['src/**/*.tpl.html'],
  tpljs: ['tmp/**/*.js'],
  unit: ['test/unit/**/*.test.js']
};
