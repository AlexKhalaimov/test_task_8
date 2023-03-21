import gulp from 'gulp';
import plumber from 'gulp-plumber';
import sass from 'gulp-dart-sass';
import postcss from 'gulp-postcss';
import autoprefixer from 'autoprefixer';
import gcmq from 'gulp-group-css-media-queries';
import csso from 'postcss-csso';
import rename from 'gulp-rename';
import htmlmin from 'gulp-htmlmin';
import terser from 'gulp-terser';
import squoosh from 'gulp-libsquoosh';
import svgSprite from 'gulp-svg-sprite';
import svgo from 'gulp-svgmin';
import cheerio from 'gulp-cheerio';
import replace from 'gulp-replace';
import del from 'del';
import browser from 'browser-sync';

// Styles

export const styles = () => {
	return gulp.src('source/scss/style.scss', { sourcemaps: true })
		.pipe(plumber())
		.pipe(sass().on('error', sass.logError))
		.pipe(gcmq())
		.pipe(postcss([autoprefixer(), csso()]))
		.pipe(rename('style.min.css'))
		.pipe(gulp.dest('build/css', { sourcemaps: '.' }))
		.pipe(browser.stream());
};

// HTML

const html = () => {
	return gulp.src('source/*.html')
		.pipe(htmlmin({ collapseWhitespace: true }))
		.pipe(gulp.dest('build'));
};

// Scripts

export const scripts = () => {
	return gulp.src('source/js/*.js')
		.pipe(terser())
		.pipe(rename('common.min.js'))
		.pipe(gulp.dest('build/js'))
		.pipe(browser.stream());
};

// Images

const optimizeImages = () => {
	return gulp.src('source/img/**/*.{png,jpg,svg}')
		.pipe(squoosh())
		.pipe(gulp.dest('build/img'));
};

const copyImages = () => {
	return gulp.src(['source/img/**/*.{png,jpg,svg}'])
		.pipe(gulp.dest('build/img'));
};

// SVG

const svg = () => gulp.src(['source/img/*.svg'])
	.pipe(svgo())
	.pipe(gulp.dest('build/img'));

// SVG sprite
export const sprite = () => {
	return gulp.src('source/img/icons/inline/*.svg')
		// minify svg
		.pipe(svgo({
			js2svg: {
				pretty: true
			}
		}))
		// remove all fill, style and stroke declarations in out shapes
		.pipe(cheerio({
			run: function ($) {
				$('[fill]')
					.removeAttr('fill');
				$('[stroke]')
					.removeAttr('stroke');
				$('[style]')
					.removeAttr('style');
			},
			parserOptions: { xmlMode: true }
		}))
		// cheerio plugin create unnecessary string '&gt;', so replace it.
		.pipe(replace('&gt;', '>'))
		// build svg sprite
		.pipe(svgSprite({
			mode: {
				symbol: {
					sprite: "../sprite.svg",
					dimensions: '%s',
					prefix: '.icon-%s',
					render: {
						scss: {
							dest: "../../scss/_sprite.scss",
						}
					}
				}
			}
		}))
		.pipe(gulp.dest('img'));
};

// Clean

const clean = () => {
	return del('build');
};

// Server

const server = (done) => {
	browser.init({
		server: {
			baseDir: 'build'
		},
		cors: true,
		notify: false,
		ui: false,
	});
	done();
};

// Reload
const reload = (done) => {
	browser.reload();
	done();
};

// Watcher

const watcher = () => {
	gulp.watch(['source/scss/**/*.scss'], gulp.series(styles));
	gulp.watch('source/js/*.js', gulp.series(scripts));
	gulp.watch('source/*.html', gulp.series(html, reload));
};

// Build

export const build = gulp.series(clean, gulp.parallel(styles, html, scripts, optimizeImages, copyImages, svg, sprite));

// Default

export default gulp.series(clean, gulp.parallel(styles, html, scripts, optimizeImages, copyImages, svg, sprite), gulp.series(server, watcher));
