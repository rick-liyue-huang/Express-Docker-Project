
## Express-Docker-Project

#### Introduction

#### Rules

1. using the Reg to show the different url for the same page:
```js
app.get('^/$|/index(.html)?', (req, res) => {
	res.sendFile(path.join(__dirname, 'views', 'index.html'));
});
```

2. for some page, we can re-direct to different url with 301 status by default:
```js
app.get('/old-page(.html)?', (req, res) => {
	res.redirect(301, '/new-page'); // 302 by default
});
```

3. for other not yet config page, we should use '*', but put it in the end, but need 'status(404)':
```js
app.get('*', (req, res) => {
	res.status(404);
	if (req.accepts('html')) {
		res.sendFile(path.join(__dirname, 'views', '404.html'));
	}
	else if (req.accepts('json')) {
		res.json({error: '404 not found'})
	}
	else {
		res.type('txt').send('404 not found')
	}
});
```

4. router handler use next() to get the response
```js
app.get('/hello(.html)?',
	(req, res, next) => {
		console.log('attempt to handle hello.html');
		next(); // will go to the next route rule
	},
	(req, res) => {
		res.send('hello world');
	}
)
```

5. the express router middleware is the router handler with 'next' parameters, we can use multiple handlers in one route by putting in  '[]':
```js
app.get('/chain(.html)?', [one, two, three]);
```


#### Middlewares

Should know some built-in and third-part middlewares:
1. `app.use(express.urlencoded({extended: false}))` for C'ontent-type: application/x-www-form-urlencoded' format; 
2. `app.use(express.json())` for response json format;
3. `app.use(express.static(path.join(__dirname, 'public')))` for accessing the public static resources, and also need to note that the public is default as the public resource root path, so the path in xxx.html will be `<link rel="stylesheet" href="css/style.css" />`, and we can get it by visit 'http://localhost:3500/css/style.css';
4. `app.use(cors())` will solve the problem of 'cross-origin-server', but we also can extend the cors middleware by define the whileList:
```js
const whiteList = ['https://www.google.com', 'https://www.your-site.com', 'http://127.0.0.1:3500', 'http://localhost:3500'];
const corsOptions = {
	origin: (origin, callback) => {
		if (whiteList.indexOf(origin) !== -1) {
			callback(null, true) // null for error, and true for 'yes it is same origin'
		} else {
			callback(new Error('Not allowed by CORS'))
		}
	},
	optionsSuccessStatus: 200
}
app.use(cors(corsOptions));
```
5. we also can define the custom middleware, and use `app.use(logger)` to get the info from logEvent;
6. the custom middleware also can add err args to deal with some error page:
```js
const errorHandler = (err, req, res, next) => {
	console.log(err.stack);
	res.status(500).send(err.message);
};
```

#### Router

The router can be acted as the middleware, and the static resource also should be add router path respectively.
```js
app.use('/', express.static(path.join(__dirname, 'public')));
app.use('/subdir', express.static(path.join(__dirname, 'public')));
app.use('/subdir', router);

```

The router methods used here include get, post, put and delete, we can put them together,

```js
employeeRouter
	.route('/')
	.get((req, res) => {
		res.json(data.empployees)
	})
	.post((req, res) => {
		res.json({
			'firstname': req.body.firstname,
			'lastname': req.body.lastname
		});
	})
	.put((req, res) => {
		res.json({
			'firstname': req.body.firstname,
			'lastname': req.body.lastname
		});
	})
	.delete((req, res) => {
		res.json({'id': req.body.id})
	});

employeeRouter.route('/:id')
	.get((req, res) => {
		res.json({id: req.params.id})
	})

```

#### MVC pattern

The express frameworks is using MVC patter when 


#### Auth Router

firstly, use MVC pattern to get the login and register controller and router,
secondly, use JWT to store the auth user information, note that: 
1. Access Token: sent as JSON, Client stores in memory, do not store in local storage or cookie;
2. Refresh Token: sent as httpOnly cookie, not accessible via javascript, must have expiry at some time;
3. Access Token: issued at authorization, client uses for API access until expires, verified with middleware, new token issued at refresh token request;
4. Refresh Token: issued at authorization, client uses to request new access token, verified with endpoint and database, must be allowed to expire or logout;


I create secrete key in .env file by taping `require('crypto').randomBytes(64).toString('hex')` and get them.

Authentication: the process of verifying who someone is;
Authorization: the process of verifying what resources a user has access to;
JSON Web Tokens: confirm authentication, allow access to API endpoints, endpoints provide data resources, use authorization header
