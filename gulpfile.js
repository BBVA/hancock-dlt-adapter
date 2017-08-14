const gulp = require('gulp');
const istanbul = require('gulp-istanbul');
const jasmine = require('gulp-jasmine');
const jshint = require('gulp-jshint');
const nodemon = require('gulp-nodemon');
const raml2html = require('gulp-raml2html');
const sonar = require('gulp-sonar');
const isparta = require('isparta');

function errorHandler(error) {
  console.log(error.toString());
  this.emit('end')
}

gulp.task('apidoc', function() {
  return gulp.src('raml/api.raml')
    .pipe(raml2html())
    .pipe(gulp.dest('documentation'));
});

gulp.task('start', function() {
  nodemon({
    script: 'index.js',
    watch: ['**/*.js', '!tests/**/*'],
    env: {
      'NODE_ENV': 'local'
    }
  });
});

gulp.task('debug', function() {
  nodemon({
    exec: 'node --inspect',
    script: 'index.js',
    watch: ['**/*.js', '!tests/**/*'],
    env: {
      'NODE_ENV': 'local'
    }
  });
});

gulp.task('pre-test', function() {
  return gulp.src(['./index.js', './app/**/*.js'])
    .pipe(istanbul({
      instrumenter: isparta.Instrumenter,
      includeUntested: true
    }))
    .pipe(istanbul.hookRequire());
});

gulp.task('test', ['pre-test'], function() {
  process.env.NODE_ENV = 'test';
  return gulp.src(['tests/**/*Spec.js'])
    .pipe(jasmine({
      errorOnFail: false
    })).on('error', errorHandler)
    .pipe(istanbul.writeReports({
      reporters: ['text', 'text-summary', 'html', 'cobertura', 'lcov'],
      reportOpts: {
        dir: './coverage'
      }
    }));
});

gulp.task('lint', function() {
  return gulp.src('./app/**/*.js', './tests/**/*.js')
    .pipe(jshint())
    .pipe(jshint.reporter('YOUR_REPORTER_HERE'));
});

gulp.task('sonar', function() {
  var options = {
    sonar: {
      host: {
        url: 'http://dev-kst-sonarqube.kickstartteam.es:19000/'
      },
      projectKey: 'sonar:archer-ms-blockchain-adapter',
      projectName: 'archer-ms-blockchain-adapter',
      projectVersion: '0.1.0',
      // comma-delimited string of source directories
      sources: 'index.js,app/',
      language: 'js',
      sourceEncoding: 'UTF-8',
      javascript: {
        lcov: {
          reportPath: 'coverage/lcov.info'
        }
      },
      exec: {
        maxBuffer: 1024 * 1024
      }
    }
  };
  // gulp source doesn't matter, all files are referenced in options object above
  return gulp.src('thisFileDoesNotExist.js', {
      read: false
    })
    .pipe(sonar(options))
    .on('error', errorHandler);
});

gulp.task('default', ['start']);
