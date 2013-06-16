## Logger for HAProxy

Built with the [node.js](http://nodejs.org/) and the [MongoDB](http://mongodb.org/).

## Install

**NOTE:** You need to have node.js, npm and mongodb installed and running

```sh
  $ git clone git://github.com/Wu-Wu/node-halogger.git
  $ npm install
  $ node halogger.js
```

## HAProxy configuration

`HL.example.com` is a hostname with running instance of halogger.

    global
        log HL.example.com:30514 local0

    frontend app-frontend
        log-format %ci:%cp\ [%t]\ %ft/%b/%s\ %Tq/%Tw/%Tc/%Tr/%Tt\ %ST\ %U/%B\ %tsc\ %ac/%fc/%bc/%sc/%rc\ %sq/%bq\ %hr\ %hs\ %{+Q}r

## License
(The MIT License)

Copyright (c) 2013 Anton Gerasimov <[chim@cpan.org](mailto:chim@cpan.org)>

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files
(the 'Software'), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
