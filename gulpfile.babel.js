import gulp from "gulp";
import del from "del";
import sass from "gulp-sass";
import autopf from "gulp-autoprefixer";
import minifyCSS from "gulp-csso";
import babel from "gulp-babel";

sass.compoiler = require("node-sass");

const gulpdir = {
    scss: {
        watch: "src/scss/**/*.scss",
        src: "src/scss/styles.scss",
        dest: "statics/css"
    },
    js: {
        watch: "src/js/**/*.js",
        src: "src/js/*.js",
        dest: "statics/js"
    }
}

const clean = () => del(["statics/"])

const styles = () => gulp
    .src(gulpdir.scss.src)
    .pipe(sass().on("error", sass.logError))
    //autoprefixer browsers -> browserslist in package.json
    .pipe(autopf({ cascade: false }))
    .pipe(minifyCSS())
    .pipe(gulp.dest(gulpdir.scss.dest));

const js = () => gulp
    .src(gulpdir.js.src)
    .pipe(babel({
        presets: ["@babel/preset-env"]
    }))
    .pipe(gulp.dest(gulpdir.js.dest));

const watch = () => {
    gulp.watch(gulpdir.scss.watch, styles);
    gulp.watch(gulpdir.js.watch, js);
}

const ready = gulp.series([clean]);
const assets = gulp.series([styles, js]);
const postDev = gulp.series([watch]);

export const build = gulp.series([ready, assets,]);
export const dev = gulp.series([ready, assets, postDev]);