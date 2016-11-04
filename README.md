HTML template to TS
====================

This gulp plugin converts a html file with into a ts file containing an object with string template.

Writing template inside a structured HTML file is much more practical than in a one line javascript string.
Therefore this plugin turns a HTML file with templates into a js object.
You can use whatever template language you like it simply turns the html nodes into a js string.
It will take the html name file to named module and property `html` as string value.

Usage
-----
An example usage with gulp:
```javascript
var gulp        = require('gulp');
var html2ts = require('gulp-html-to-ts');

gulp.task('template', function() {
	return gulp.src('my/template.html')
	.pipe(html2ts())
  //.pipe(html2ts('app'))
  //.pipe(html2ts({ moduleName: '{$folderName}', propertyName: '{$fileName}Html'}))
	.pipe(gulp.dest('./'));
});

```

Example
-------

This example shows how this plugin turn html into a ts file.

*HTML Source* : `views/my_template.html`
```html
  <p>A {{ handlebar }} example.</p>
```

*The generated output* : `my_template.html.ts`
```typescript
module views { export var myTemplate = \`<p>A {{ handlebar }} example.</p>\`;}
```
