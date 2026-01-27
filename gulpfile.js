/** Что-бы все не пропало! **/
process.on('uncaughtException', function (err) {
    console.log(err)
});


const { src, dest, series, parallel } = require('gulp');
const fs = require('fs');
const path = require('path');

var chokidar       = require('chokidar'),
    sass           = require('sass'),
    replace        = require('gulp-replace'),
    worker         = require('rollup-plugin-web-worker-loader'),
    browser        = require('browser-sync').create()

var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var rollup = require('@rollup/stream');

// *Optional* Depends on what JS features you want vs what browsers you need to support
// *Not needed* for basic ES6 module import syntax support
var babel = require('@rollup/plugin-babel').babel;
// Add support for require() syntax
var commonjs = require('@rollup/plugin-commonjs');
// Add support for importing from node_modules folder like import x from 'module-name'
var nodeResolve = require('@rollup/plugin-node-resolve');


var cache;

var srcFolder = './src/';
var pubFolder = './public/';

var isDebugEnabled = false;

function merge(done) {
    let plugins = [babel({
        babelHelpers: 'bundled',
        presets: ['@babel/preset-env']
    }), commonjs, nodeResolve, worker()]

    rollup({
        // Point to the entry file
        input: srcFolder+"app.js",

        // Apply plugins
        plugins: plugins,

        // Use cache for better performance
        //cache: cache,

        // Note: these options are placed at the root level in older versions of Rollup
        output: {
          // Output bundle is intended for use in browsers
          // (iife = "Immediately Invoked Function Expression")
          format: 'iife',
          sourcemap: isDebugEnabled ? 'inline' : false
        },

        onwarn: function ( message ) {
            return;
        }
      })
      .on('bundle', function(bundle) {
        // Update cache data after every bundle is created
        //cache = bundle;
      })

      // Name of the output file.
      .pipe(source('app.js'))
      .pipe(buffer())
      //.pipe(uglify())
      .pipe(replace(/return kIsNodeJS/g, "return false"))
      .pipe(replace(/return kIsNodeJS/g, "return false"))
      // Where to send the output file
      .pipe(dest(pubFolder));
      
    done();
}

function lang_task(){
    return src(srcFolder + '/lang/*.js').pipe(dest(pubFolder + '/lang'));
}

/** Следим за изменениями в файлах **/
function watch(done){
    var watcher = chokidar.watch([srcFolder,pubFolder], { persistent: true, ignored: [pubFolder + '/lang']});

    var timer;
    var change = function(path){
        clearTimeout(timer)

        if(path.indexOf('.css') > -1) return;

        timer = setTimeout(
            series(merge, sass_task, lang_task)
        ,5000)
    }

    watcher.on('add', function(path) {
        console.log('File', path, 'has been added');

        change(path)
    })
    .on('change', function(path) {
        console.log('File', path, 'has been changed');

        change(path)
    })
    .on('unlink', function(path) {
        console.log('File', path, 'has been unlink');

        change(path)
    })

    done();
}

function sass_task(done){
    try {
        // Компилируем SASS используя современный API
        const result = sass.compile(srcFolder + 'sass/app.scss', {
            style: 'expanded',
            loadPaths: [srcFolder + 'sass']
        });

        // Создаем директорию если её нет
        const cssDir = pubFolder + 'css';
        if (!fs.existsSync(cssDir)) {
            fs.mkdirSync(cssDir, { recursive: true });
        }

        // Записываем результат
        fs.writeFileSync(cssDir + '/app.css', result.css);

        console.log('SASS compiled successfully');
        done();
    } catch (error) {
        console.error('SASS compilation error:', error);
        done(error);
    }
}

function enable_debug_mode(done){
    console.log("build with sourcemaps!")
    isDebugEnabled = true;
    done()
}

// Запускаем локальный сервер
function serve(done) {
    browser.init({
        server: {
            baseDir: pubFolder
        },
        port: 3000,
        ui: false,
        open: true,
        notify: false,
        ghostMode: false
    });
    done();
}

// Следим за изменениями и перезагружаем браузер
function watch_dev(done){
    var watcher = chokidar.watch([srcFolder], { persistent: true });

    var timer;
    var rebuild = function(){
        clearTimeout(timer);
        timer = setTimeout(async () => {
            console.log('Rebuilding...');
            await series(merge, sass_task, lang_task)();
            browser.reload();
        }, 1000);
    }

    watcher.on('change', function(path) {
        console.log('File', path, 'changed');
        rebuild();
    });

    done();
}

// Export tasks
exports.merge = merge;
exports.sass_task = sass_task;
exports.lang_task = lang_task;
exports.build = series(merge, sass_task, lang_task);
exports.serve = series(exports.build, serve, watch_dev);
exports.watch = watch;
exports.default = watch;
exports.debug = series(enable_debug_mode, exports.build);

