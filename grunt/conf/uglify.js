
module.exports = {
  dist: {
    files: {
      '<%= distdir %>/<%= pkg.name %>.min.js': [
        '<%= distdir %>/<%= pkg.name %>.js'
      ]
    }
  }
};
