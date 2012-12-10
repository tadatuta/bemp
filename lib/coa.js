var PATH = require('path'),
    Q = require('q'),
    FS = require('fs'),

    DEFAULT_PORT = 80,
    DEFAULT_HOST = 'localhost',
    DEFAULT_BEM_SERVER_PORT = 8080,
    DEFAULT_BEM_SERVER_HOST = '127.0.0.1',
    DEFAULT_ROUTES = {
        "/i/": "/i/",
        "/favicon.ico": "/desktop.bundles/favicon.ico",
        "/robots.txt": "/desktop.bundles/robots.txt",
        "/merged/": "/desktop.bundles/merged/",
        "/": "/desktop.bundles/index/"
    };

module.exports = require('coa').Cmd()
    .name(PATH.basename(process.argv[1]))
    .title('URL rewrite proxy for bem server.')
    .helpful()
    .opt()
        .name('version').title('Show version')
        .short('v').long('version')
        .flag()
        .only()
        .act(function() {
            var p = require('../package.json');
            return p.name + ' ' + p.version;
        })
        .end()
    .opt()
        .name('config').short('c').long('config')
        .title('routes config')
        .def(DEFAULT_ROUTES)
        .end()
    .opt()
        .name('root').short('r').long('root')
        .title('project root (type "cwd" for current working directory)')
        .val(function(d) {
            d == 'cwd' && (d = process.cwd());

            return PATH.resolve(d);
        })
        .end()
    .opt()
        .name('host').long('host')
        .title('hostname to listen on, default: localhost')
        .def(DEFAULT_HOST)
        .end()
    .opt()
        .name('bemhost').long('bemhost')
        .title('hostname bem server is listening on, default: localhost')
        .def(DEFAULT_BEM_SERVER_HOST)
        .end()
    .opt()
        .name('port').short('p').long('port')
        .title('tcp port to listen on, default: ' + DEFAULT_PORT)
        .def(DEFAULT_PORT)
        .end()
    .opt()
        .name('bemport').short('bp').long('bemport')
        .title('tcp port bem server is listening on, default: ' + DEFAULT_BEM_SERVER_PORT)
        .def(DEFAULT_BEM_SERVER_PORT)
        .end()
    .opt()
        .name('internal').title('Use bem tools from bemp/node_modules')
        .long('internal')
        .flag()
        .end()
    .opt()
        .name('global').title('Use global bem tools')
        .long('global')
        .flag()
        .end()
    .completable()
    .act(function(opts, agrs) {
        var http = require('http'),
            httpProxy = require('http-proxy'),
            routes = typeof opts.config === 'string' ? JSON.parse(FS.readFileSync(opts.config, 'utf8')) : opts.config,
            router = {};

        for (var route in routes) {
            router[opts.host + route] = opts.bemhost + ':' + opts.bemport + routes[route];
        }

        if (opts.root || opts.internal || opts.global) {
            var sys = require('sys'),
                exec = require('child_process').exec,
                puts = function(error, stdout, stderr) { sys.puts(stdout); },
                root = (!opts.root || opts.root == 'cwd') ? process.cwd() : opts.root,
                bemPath = opts.internal ? PATH.resolve(__dirname, '../node_modules/bem/bin/bem') :
                    (opts.global ? 'bem' : PATH.resolve(root, 'node_modules/bem/bin/bem'));

            console.log('BEM: ', bemPath + ' server -r ' + root + ' --host ' + opts.bemhost + ' -p ' + opts.bemport);

            exec(bemPath + ' server -r ' + root + ' --host ' + opts.bemhost + ' -p ' + opts.bemport , puts);

        }

        console.log('Your route table is');
        console.log(router);
        console.log('Server is listening on port ' + opts.port +
            '. Point your browser to http://' + opts.host + (opts.port === 80 ? '' : (':' + opts.port)) + '/');

        var options = { router: router };

        var proxyServer = httpProxy.createServer(options);

        proxyServer.listen(opts.port);
    });