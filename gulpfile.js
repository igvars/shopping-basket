/**
 * Put here your scripts, what need to build
 */
var scripts 	= [
        // Package libraries here
        'node_modules/jquery/dist/jquery.min.js',
        'node_modules/bootstrap-sass/assets/javascripts/bootstrap.min.js',
        'node_modules/slick-carousel/slick/slick.min.js',
        'node_modules/bootstrap-select/dist/js/bootstrap-select.min.js',
        'node_modules/handlebars/dist/handlebars.min.js',
        'node_modules/decimal.js/decimal.min.js',

        // Another scripts here
        'src/js/Order.js',
        'src/js/Category.js',
        'src/js/Post.js',
        'src/js/Basket.js',
        'src/js/App.js'
    ],
    watchScripts	=[
        'src/js/*.js'
    ],
    styles 	= [
        'src/scss/styles.scss'
    ],
    watchStyles 	= [
        'src/scss/*.scss'
    ],
    wantToMove = [
        {
            from: 'src/fonts/**/*',
            to: 'dist/fonts'
        },{
            from: 'node_modules/font-awesome/fonts/**/*',
            to: 'dist/fonts'
        },{
            from: 'node_modules/slick-carousel/slick/fonts/**/*',
            to: 'dist/fonts'
        },{
            from: 'node_modules/bootstrap-sass/assets/fonts/bootstrap/*',
            to: 'dist/fonts/bootstrap'
        }
    ],

// define libraries
    gulp 			= require('gulp'),
    autoPrefixer 	= require('gulp-autoprefixer'),
    concat 			= require('gulp-concat'),
    uglify 			= require('gulp-uglify'),
    plumber 		= require('gulp-plumber'),
    sourcemaps      = require('gulp-sourcemaps'),
    sass 			= require('gulp-sass');

// Handler for exception
function errorHandler(error){
    console.error('Gulp build error!');
    console.error(error.message);
    this.emit('end');
}

/**
 * Move any files
 */
gulp.task('move', function(){
    if(!wantToMove.length)
        return true;

    for(var i in wantToMove){
        if(wantToMove.hasOwnProperty(i)) {
            gulp.src(wantToMove[i].from)
                .pipe(plumber({errorHandler: errorHandler}))
                .pipe(gulp.dest(wantToMove[i].to));
        }
    }
});

/**
 * Build SASS files, concat and minify for production
 * */
gulp.task('styles', function(){
    gulp.src(styles)
        .pipe(plumber({errorHandler: errorHandler}))
        .pipe(sourcemaps.init())
        .pipe(sass({outputStyle: 'compressed'}))
        .pipe(sourcemaps.write())
        .pipe(autoPrefixer({browsers: ['last 15 versions', '> 1%']}))
        .pipe(concat('styles.min.css'))
        .pipe(gulp.dest('dist/css'));
});

/**
 * Concat, minify and move to right folder
 */
gulp.task('scripts', function(){
    gulp.src(scripts)
        .pipe(plumber({errorHandler: errorHandler}))
        .pipe(concat('scripts.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest('dist/js'));
});

/**
 * Run gulp watcher, for listen to changes of watch files
 */
gulp.task('watch', function(){
    gulp.watch(watchStyles, ['styles']);
    gulp.watch(watchScripts, ['scripts']);
});

/**
 * Default task for gulp
 */
gulp.task('default', ['styles', 'scripts', 'move']);