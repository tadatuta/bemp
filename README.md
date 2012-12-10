bemp is a simple URL router proxy for [bem server](http://bem.info/tools/bem/commands/).

# Installation

``sudo npm install -g bemp``

# Usage
``sudo bemp --root ~/Sites/bem-www/ -c sample-routes.json``

# Basic default routes

````javascript
{
    "/i/": "/i/",
    "/favicon.ico": "/desktop.bundles/favicon.ico",
    "/robots.txt": "/desktop.bundles/robots.txt",
    "/merged/": "/desktop.bundles/merged/",
    "/": "/desktop.bundles/index/"
}
````