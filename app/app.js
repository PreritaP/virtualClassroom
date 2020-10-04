const constant   	= require(__basePath + 'app/config/constants');
const express       = require('express');
const app 			= express();
const bodyParser 	= require('body-parser');
const validator  	= require('express-validator');
const hbs 			= require('hbs');
const exception  	= require(constant.path.app + 'core/exception');
const config     	= require(constant.path.app + 'core/configuration');
const viewsPath 	= constant.path.app + 'module/templates/views';
const publicLib 	= constant.path.app + '../public';
const partialPath 	= constant.path.app + 'module/templates/partials';

// console.log(viewsPath);
app.set('view engine','hbs');
app.set('views', viewsPath);
hbs.registerPartials(partialPath);


app.use(require('express').static(publicLib));
app.get('',(req, res)=> {
	res.render('index');
});

app.get('/classRoom',(req, res)=> {
	res.render('classroom');
});

app.get('/history',(req, res)=> {
	res.render('history');
});


/*
 * @description Middlewares for parsing body
 */
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(validator({}));


/*
 * Injecting all dependencies Modules + common libs
 */
require(constant.path.app + 'config/routes')(app);

/*
 * @description Catch 404 error if no route found
 */
app.use(function (req, res) {
    return res.status(400).json({
        status       : false,
        statusMessage: '404 - Page Not found'
    });
});

/*
 * @description Error handler
 */
app.use(exception.errorHandler);


module.exports = app;
