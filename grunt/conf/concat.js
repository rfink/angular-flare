
module.exports = {
  dist: {
    src: [
      'module.prefix',
      '<%= src.js %>',
      '<%= src.tpljs %>',
      'module.suffix'
    ],
    dest: '<%= distdir %>/<%= pkg.name %>.js'
  }
};
