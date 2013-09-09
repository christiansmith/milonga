# Milonga

Milonga is a helper for defining a set of RESTful Express routes based on [Modinha](https://github.com/christiansmith/Modinha) models. 

## Installation and Usage

    $ npm install milonga

In an Express app, just require Milonga and register your model at a base path:

    require('milonga')(app)
    app.resource('/api/v1/widgets', Widget);


Now we have a set of routes for Widget.

Optionally, add route specific middleware, such as authentication, as the last argument to `app.resource()`.

    var middleware = passport.authenticate('basic', { session: false });
    app.resource('/api/v1/sprockets', Sprocket, middleware);



## The MIT License

Copyright (c) 2013 Christian Smith http://anvil.io

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
