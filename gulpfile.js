var gulp          = require('gulp'),
		gutil         = require('gulp-util' ),
		sass          = require('gulp-sass'),
		browserSync   = require('browser-sync'),
		concat        = require('gulp-concat'),
		uglify        = require('gulp-uglify'),
		cleancss      = require('gulp-clean-css'),
		rename        = require('gulp-rename'),
		autoprefixer  = require('gulp-autoprefixer'),
		notify        = require("gulp-notify"),
		sourcemaps = require('gulp-sourcemaps'),
		pug		  = require('gulp-pug');

// Static server
gulp.task('browser-sync', function() {
	browserSync({
		server: {
			baseDir: 'assets'
		},
		notify: false,
	})
  });

gulp.task('styles', function() {
	return gulp.src('src/scss/**/*.scss')
	.pipe(sourcemaps.init())
	.pipe(sass({ outputStyle: 'expanded' }).on("error", notify.onError()))
	.pipe(rename({ suffix: '.min', prefix : '' }))
	.pipe(autoprefixer(['last 15 versions']))
	// .pipe(gcmq())
	.pipe(cleancss( {level: { 1: { specialComments: 0 } } })) // Opt., comment out when debugging
	.pipe(sourcemaps.write())
	.pipe(gulp.dest('assets/css'))
	.pipe(browserSync.stream())
});

gulp.task('js', function() {
	return gulp.src([
		'src/js/custom.js', // Always at the end
		])
	.pipe(concat('custom.js'))
	.pipe(uglify()) // Mifify js (opt.)
	.pipe(gulp.dest('assets/js'))
	.pipe(browserSync.reload({ stream: true }))
});

gulp.task('pug', function() {
	return gulp.src('src/pug/pages/**/*.pug')
		.pipe(pug({
			pretty: true
		}))
		.pipe(gulp.dest('assets/'))
		.pipe(browserSync.stream())

});

gulp.task('images', function() {
	return gulp.src([
	  'src/img/**/*.{gif,jpg,png,svg,webp}',
	])
	  .pipe(gulp.dest('assets/img'))
  });

gulp.task('fonts', function() {
	return gulp.src('src/fonts/**/*.{eot,ttf,woff}')
	  .pipe(gulp.dest('assets/fonts'))
  });

gulp.task('watch', gulp.parallel('styles', 'js', 'pug', 'images', 'fonts', 'browser-sync', function() {
	gulp.watch('src/scss/**/*.scss', gulp.series('styles'));
	gulp.watch(['src/**/*.js'], gulp.series('js'));
	gulp.watch('src/pug/**/*.pug', gulp.series('pug'));
	gulp.watch('src/img/**/*.{gif,jpg,png,svg}', gulp.series('images'));
	gulp.watch('src/fonts/**/*.{eot,ttf,woff,svg,woff2}', gulp.series('fonts'));
	gulp.watch('assets/*.html', browserSync.reload)

}));

gulp.task('default', gulp.series('watch'));
