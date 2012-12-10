bemp is a simple URL router proxy for [bem server](http://bem.info/tools/bem/commands/) built on top of [COA](https://github.com/veged/coa) and [node-http-proxy](https://github.com/nodejitsu/node-http-proxy).

### Features:

* Use manually started bem server with params ``--bemhost`` (default is localhost) and ``--bemport`` (default is 8080).
* Use local project's bem server (e.g. ``-r cwd``).
* Use bem server from its own dependancies (flag ``--internal``).
* Use globally install bem server (flag ``--global``).
* Some very basic [default routes table](#basic-default-routes) built-in.


## Installation

``sudo npm install -g bemp``

## Usage
``sudo bemp --root ~/Sites/bem-www/ -c sample-routes.json``
sudo is required to launch server on 80 port

You can specify host, port and project root. All the params are optional.
See ``bemp --help`` for details.

## Basic default routes

````javascript
{
    "/i/": "/i/",
    "/favicon.ico": "/desktop.bundles/favicon.ico",
    "/robots.txt": "/desktop.bundles/robots.txt",
    "/merged/": "/desktop.bundles/merged/",
    "/": "/desktop.bundles/index/"
}
````

Take a look at [sample-routes.json](https://github.com/tadatuta/bemp/blob/master/sample-routes.json) for more examples (it's a route table for [bem.info](http://bem.info/) actually).