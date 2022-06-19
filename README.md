
## Express-Docker-Project

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
	res.status(404).sendFile(path.join(__dirname, 'views', '404.html'));
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






