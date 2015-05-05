// *** Plugins ***

var browserify = require('gulp-browserify'),
    compass = require('gulp-compass'),
    concat = require('gulp-concat'),
    connect = require('gulp-connect'),
    coffee = require('gulp-coffee'),
    gulp = require('gulp'),
    gutil = require('gulp-util');


// *** Sources ***

var coffeeSources = ['components/coffee/tagline.coffee'];

var jsSources = [
    'components/scripts/rclick.js',
    'components/scripts/pixgrid.js',
    'components/scripts/tagline.js',
    'components/scripts/template.js'
];

var jsonSources = ['builds/development/js/*.json'];

// All styles imported into a single stylesheet
// on this project, so we only need a single src
// when processing to CSS
var sassSources = ['components/sass/style.scss'];

// For gulp watch, we need to check for changes
// to any scss file, including partials, in order
// to trigger processing of CSS
var sassSourcesAll = 'components/sass/*.scss';

var htmlSources = ['builds/development/*.html'];

// *** Gulp Tasks ***

// gulp.task('log', function () {
//     gutil.log('Workflows are awesome!');
// });

gulp.task('coffee', function () {
    gulp.src(coffeeSources)
        .pipe(coffee({ bare: true })
            .on('error', gutil.log))
		.pipe(gulp.dest('components/scripts'));
});

gulp.task('js', function () {
    gulp.src(jsSources)
        .pipe(concat('script.js'))
        .pipe(browserify())
        .pipe(gulp.dest('builds/development/js'))
        .pipe(connect.reload());
});

gulp.task('compass', function () {
    gulp.src(sassSources)
        // Provide Compass config object directly (vs. config.rb)
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
        .pipe(gulp.dest('builds/development/css'))
        .pipe(connect.reload());
});

gulp.task('json', function () {
    gulp.src(jsonSources)
        .pipe(connect.reload());
});

gulp.task('html', function () {
    gulp.src(htmlSources)
        .pipe(connect.reload());
});

gulp.task('watch', function () {
    gulp.watch(htmlSources, ['html']);
    gulp.watch(coffeeSources, ['coffee']);
    gulp.watch(jsSources, ['js']);
    gulp.watch(jsonSources, ['json']);
    gulp.watch(sassSourcesAll, ['compass']);
});


gulp.task('connect', function () {
    connect.server({
        livereload: true,
        root: 'builds/development/'
    });
});


// *** Default ***

gulp.task('default', ['html', 'coffee', 'js', 'json', 'compass', 'connect', 'watch']);
