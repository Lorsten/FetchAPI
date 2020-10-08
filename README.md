# Gulp template website

## Automatic
The purpose of autmatic task is to automatically handle things like minify both javascript and css file to make them smaller instead of having to manually do it. Having seperate files to work with and automatically move them to a public directory. Beeing able to also automatically compress images instead of having to mannually to it yourself is a benefit. 

### Plugins used
* chache - Used in the project to cache compressed images, instead of redoing it every time the task is ran
* BrowserSync - Plugin for reloading the page after changed in the code has been detected.
* Uglify - Using it to minify fy javascript files to make the filesize smaller.
* concat - Merging together two js/css files.
* imagemin - Using it to compress images to a smaller size.
* cleanCSS - Using it to minify the css code.
* sass - Used for compiling sass code.
* del Used for cleaning out the folder of old files.
* gulpe-rename is used for renaming the sass files to style .scss 

### System
First run npm install in the project directory to install. 
To start the system, simply type gulp in the console while in the projects directory

#### Taskes used in the program
* CopyHTML - copy the html files to the public directory
* clean - Clear the public directory from old files
* handleImg - Compress and cache images to make them smaller.
* mangeImages - Clear image folder and run the task handleImg
* jsTack - concat the js files and then uglify them folloed by moving them to pub folder.
* script - Run jstack and the reload function to reload the page when the code changes.
* cssTask - Concat the css files and run cleanCSS to minify it. Moving it to pub/css afterward.
* sasstask - same as csstask expect using sass to compile it and browser sync.stream to reload the page after the code has compiled.


#### Author Olof Andersson
