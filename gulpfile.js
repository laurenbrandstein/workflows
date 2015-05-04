var browserify = require('gulp-browserify'),
    concat = require('gulp-concat'),
    coffee = require('gulp-coffee'),
    gulp = require('gulp'),
    gutil = require('gulp-util');

var coffeeSrcs = ['components/coffee/tagline.coffee'];
var jsSources = [
    'components/scripts/rclick.js',
    'components/scripts/pixgrid.js',
    'components/scripts/tagline.js',
    'components/scripts/template.js'
];

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

gulp.task('default', ['coffee', 'js']);