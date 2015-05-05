// *** Plugins ***

var browserify = require('gulp-browserify'),
    compass = require('gulp-compass'),
    concat = require('gulp-concat'),
    connect = require('gulp-connect'),
    coffee = require('gulp-coffee'),
    gulp = require('gulp'),
    gulpif = require('gulp-if'),
    gutil = require('gulp-util'),
    uglify = require('gulp-uglify');


// *** Environment & Sources ***

var coffeeSources,
    env,
    htmlSources,
    jsSources,
    jsonSources,
    outputDir,
    sassSources,
    sassStyle,
    sassSourcesAll;

// Environment
env = process.env.NODE_ENV || 'development';

if (env === 'development') {
    outputDir = 'builds/development/';
    sassStyle = 'expanded';
} else {
    outputDir = 'builds/production/';
    sassStyle = 'compressed';
}

coffeeSources = ['components/coffee/tagline.coffee'];

jsSources = [
    'components/scripts/rclick.js',
    'components/scripts/pixgrid.js',
    'components/scripts/tagline.js',
    'components/scripts/template.js'
];

jsonSources = [outputDir + 'js/*.json'];

// All styles imported into a single stylesheet
// on this project, so we only need a single src
// when processing to CSS
sassSources = ['components/sass/style.scss'];

// For gulp watch, we need to check for changes
// to any scss file, including partials, in order
// to trigger processing of CSS
sassSourcesAll = 'components/sass/*.scss';

htmlSources = [outputDir + '*.html'];

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
        .pipe(gulpif(env === 'production', uglify()))
        .pipe(gulp.dest(outputDir + 'js'))
        .pipe(connect.reload());
});

gulp.task('compass', function () {
    gulp.src(sassSources)
        // Provide Compass config object directly (vs. config.rb)
        .pipe(compass(
            {
                image: outputDir + 'images',
                // Here is where you would require other libraries
                // https://npmjs.org/package/gulp-load-plugins
                // require: ['susy', 'modular-scale'],
                sass: 'components/sass',
                style: sassStyle
            }
        ))
            .on('error', gutil.log)
        .pipe(gulp.dest(outputDir + 'css'))
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
        root: outputDir
    });
});


// *** Default ***

gulp.task('default', ['html', 'coffee', 'js', 'json', 'compass', 'connect', 'watch']);
