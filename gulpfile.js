const gulp = require("gulp"),
  connect = require("gulp-connect"),
  pug = require("gulp-pug"),
  sass = require("gulp-sass")(require("sass")),
  autoprefixer = require("gulp-autoprefixer"),
  sourcemaps = require("gulp-sourcemaps"),
  uglify = require("gulp-uglify");

// Compile Pug Files
gulp.task("compile-pug", () =>
  gulp
    .src(["./stage/html/**.pug", "!./stage/html/header.pug", "!./stage/html/sidebar.pug"])
    .pipe(pug())
    .pipe(gulp.dest("./docs/"))
    .pipe(connect.reload())
);

// Compile Sass Files With Prefixes
gulp.task("compile-sass", () =>
  gulp
    .src("./stage/sass/main.sass")
    .pipe(sourcemaps.init())
    .pipe(sass({ outputStyle: "compressed" }))
    .pipe(autoprefixer("last 2 versions"))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest("./docs/assets/"))
    .pipe(connect.reload())
);

// Compile Sass Files With Prefixes With No Map
gulp.task("nomap-sass", () =>
  gulp
    .src("./stage/sass/main.sass")
    .pipe(sass({ outputStyle: "compressed" }))
    .pipe(autoprefixer("last 2 versions"))
    .pipe(gulp.dest("./docs/assets/"))
    .pipe(connect.reload())
);

// Redirect JS Files
gulp.task("redirect-js", () =>
  gulp.src("./stage/js/**.js").pipe(uglify()).pipe(gulp.dest("./docs/assets/js/")).pipe(connect.reload())
);

// Redirect Images
gulp.task("redirect-images", () => gulp.src("./stage/images/**/*.*").pipe(gulp.dest("./docs/assets/images/")));

// Start Server & Watch Changes
gulp.task("default", () => {
  connect.server({
    root: "./docs/",
    livereload: true,
  });
  gulp.watch("./stage/html/**/*.pug", gulp.series(["compile-pug", "redirect-images"]));
  gulp.watch("./stage/sass/**/*.sass", gulp.series("compile-sass"));
  gulp.watch("./stage/js/**/*.js", gulp.series("redirect-js"));
});
