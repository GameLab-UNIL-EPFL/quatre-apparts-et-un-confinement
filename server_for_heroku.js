const path = require('path');
const express = require('express');

const app = express();

app.use(express.static(path.join(__dirname, 'dist')));
app.get('/robots.txt', (_, res) => {
    res.type('text/plain');
    res.send("User-agent: *\nDisallow: /");
});

app.set('port', process.env.PORT || 8080);

const server = app.listen(app.get('port'), () => {
    console.log('listening on port ', server.address().port);
});
