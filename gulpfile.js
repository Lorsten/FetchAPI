// Loading required files
const gulp = require("gulp");
const {src, dest, watch,series,parallel } = require("gulp");
const concat = require('gulp-concat');
const uglify = require('gulp-uglify-es').default;
const browserSync = require('browser-sync').create();
const reload = browserSync.reload;
const sass = require('gulp-sass');
const rename = require('gulp-rename');
const del = require('del');
const cleanCSS = require('gulp-clean-css');
const imagemin = require('gulp-imagemin');
const cache = require("gulp-cache");
const babel = require('gulp-babel');


/*
Creating all the search paths for different file extensions.
For the images only jpg, png and svg can be used.
*/
const files = {
    htmlPath: "src/**/*.html",
    cssPath: "src/**/*.css",
    sassPath: "src/**/*.scss",
    jsPath: "src/**/*.js",
    imgPath: "src/images/*.{jpg,png,svg}"

}
/*
Function for deleting old files at the start using the plugin del
*/
const clean = (done) => {
    del.sync("pub/**");
    done();
}

// a function for copying the hmtl files to the public directory
const copyHTML = () => {
    return src(files.htmlPath)
        .pipe(dest('pub'));
}

/*
Function for Clearing the img folder in pub/images. 
Used for deleting a image when the source image is deleted
*/
const clearImages = (done) =>{
    del.sync("pub/images/**");
    done();
}

/*
Task for handling the images

* Using the plugin cache to cache the compressed images so it doesn't have to repeat the process everytime this function is ran

THe plugin imagemin is used to compress images with the setting interlaced to true for slower internet connections
*/
const handleImg = () => {
    return src(files.imgPath)
    .pipe(cache(imagemin({
        interlaced: true
      })))
        .pipe(dest('pub/images'));
}
/*
Main task for handling omages
*first the directory is cleaned using  the function clearImages and then running the task handleIMG
Using a gulp series and a callback to run each task when a task is finished
*/
const manageImages = (done) =>{
    return series(
       clearImages,
       handleImg,
       done =>{
           done();
       }
    )(done)
}

/*
 Task for javascript files
 Merge js files 
 Compile with babel
 and then minify using the plugin uglify
 */
const jsTask = () => {
    return src(files.jsPath)
        .pipe(concat('main.js'))
<<<<<<< HEAD
=======
         .pipe(babel({
            presets: ["@babel/preset-env"]
          }))
>>>>>>> d6c9dac1e26ab8b865fc614fda1d9048483ee58a
        .pipe(uglify())
        .pipe(dest('pub/js'))
}

/*
Function using browserSync to reload the page 
*/
const reloading = (done) => {
    browserSync.reload();
    done();
}

/* Main task for javascript files.

* jstack is ran first followed by the reloading function to reload the page.

* A callback is used to run the task after each task is done

*/
const script = (done) => {
    return series(
        jsTask,
        reloading,
        done => {
            done();
        }
    )(done)
}

/*
Task for handling the css File 

* Merging two or more files into one with the plugin concat

* Using cleanCSS to minify the file.

* Then placing the file in pub/css
*/
const cssTask = () => {
    return src(files.cssPath)
        .pipe(concat("style.css"))
        .pipe(cleanCSS())
        .pipe(dest("pub/css"))
}


/*
Same as cssTask expect for sass

* Compile the files using the plugin sass and using the option outputstyle compressed to minify the outputed file

* Using the plugin gulp-rename to rename the source file to style.css

* Using browsersync stream to reload the page after the file has been compiled
*/  
const sassTask = () => {
    return src(files.sassPath)
        .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
        .pipe(rename('style.css'))
        .pipe(dest("pub/css"))
        .pipe(browserSync.stream());
}

/*
Function for watching all the task.
Setting up browsersync here to allow for automatic reloading whenever a file is changed
*/
const watchTask = () => {
    browserSync.init({
        server: {
            baseDir: "./pub",
            index: "/index.html"
        }
    });
  
    /* watching the html files separately, 
    and running a manual browsersync reload whenever the html files changes*/
    watch(files.htmlPath).on("change", series(copyHTML, reload));

    watch([files.cssPath, files.jsPath, files.sassPath,files.imgPath],
        parallel(cssTask, script, sassTask, manageImages)
    );
}

// Export as default task
exports.default = series(
    parallel(clean, copyHTML, cssTask, jsTask, sassTask, handleImg),
    watchTask
);