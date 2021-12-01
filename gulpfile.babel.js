import gulp from "gulp";
import del from "del";
import gimg from 'gulp-imagemin';
import autoprefixer from "gulp-autoprefixer";
import minifyCSS from "gulp-csso";
import uglify from "gulp-uglify";
import babel from "gulp-babel";
import typescript from "gulp-typescript";

var sass = require('gulp-sass')(require('sass'));

const gulpdir = {
    img: {
        src: "src/img/*",
        dest: "statics/img"
    },
    scss: {
        watch: "src/scss/**/*.scss",
        src: "src/scss/styles.scss",
        dest: "statics/css"
    },
    js: {
        watch: "src/js/**/*.js",
        src: "src/js/*.js",
        dest: "statics/js"
    },
    ts: {
        watch: "src/ts/**/*.ts",
        src: "src/ts/*.ts",
        dest: "statics/ts" 
    }
}

const clean = () => del(["statics/"])

const img = () => gulp
                .src(gulpdir.img.src)
                .pipe(gimg())
                .pipe(gulp.dest(gulpdir.img.dest));

const styles = () => gulp
    .src(gulpdir.scss.src)
    .pipe(sass().on("error", sass.logError))
    //autoprefixer browsers -> browserslist in package.json
    .pipe(autoprefixer({ cascade: false }))
    .pipe(minifyCSS())
    .pipe(gulp.dest(gulpdir.scss.dest));

const js = () => gulp
    .src(gulpdir.js.src)
    .pipe(babel({
        presets: ["@babel/preset-env"]
    }))
    .pipe(uglify())
    .pipe(gulp.dest(gulpdir.js.dest));

const ts = () => gulp
    .src(gulpdir.ts.src)
    .pipe(typescript({
        target: 'ES5',
        removeComments: true,
    }))
    .pipe(gulp.dest(gulpdir.ts.dest))

const watch = () => {
    gulp.watch(gulpdir.img.src, img);
    gulp.watch(gulpdir.scss.watch, styles);
    gulp.watch(gulpdir.js.watch, js);
    gulp.watch(gulpdir.ts.watch, ts);
}

const ready = gulp.series([clean, img]);
const assets = gulp.series([styles, js, ts]);
const postDev = gulp.series([watch]);

export const build = gulp.series([ready, assets,]);
export const dev = gulp.series([ready, assets, postDev]);