// *** Plugins ***

var browserify = require('gulp-browserify'),
    compass = require('gulp-compass'),
    concat = require('gulp-concat'),
    coffee = require('gulp-coffee'),
    gulp = require('gulp'),
    gutil = require('gulp-util');


// *** Sources ***

var coffeeSrcs = ['components/coffee/tagline.coffee'];

var jsSources = [
    'components/scripts/rclick.js',
    'components/scripts/pixgrid.js',
    'components/scripts/tagline.js',
    'components/scripts/template.js'
];

// All styles imported into a single stylesheet
// on this project, so we only need a single src
var sassSources = ['components/sass/style.scss'];


// *** Gulp Tasks ***

// gulp.task('log', function () {
//     gutil.log('Workflows are awesome!');
// });

gulp.task('coffee', function () {
    gulp.src(coffeeSrcs)
        .pipe(coffee({ bare: true })
            .on('error', gutil.log))
		.pipe(gulp.dest('components/scripts'));
});

gulp.task('js', function () {
    gulp.src(jsSources)
        .pipe(concat('script.js'))
        .pipe(browserify())
		.pipe(gulp.dest('builds/development/js'));
});

gulp.task('compass', function () {
    gulp.src(sassSources)
        .pipe(compass(
            {
                image: 'builds/development/images',
                // Here is where you would require other libraries
                // https://npmjs.org/package/gulp-load-plugins
                // require: ['susy', 'modular-scale'],
                sass: 'components/sass',
                style: 'expanded'
            }
        ))
            .on('error', gutil.log)
        .pipe(gulp.dest('builds/development/css'));
});

gulp.task('default', ['coffee', 'js']);