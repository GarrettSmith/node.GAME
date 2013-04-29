module.exports = {

    global: {
        address: 'localhost',
    },

    server: {
        components: [
            'server/js/web_server',
            'server/js/repl_server',
            'server/js/socket_server',
            'server/js/socket_ping'
        ],
        repl: './repl_local',
        enable_repl: true
    },

    client: {
        client_components: [
            'socket_client',
            'socket_reader'
        ],
        shared_components: [
        ]
    },

    repl: {
        prompt: 'node.GAME > '
    },

    repl_server: {
        port: 5001
    },

    repl_local: {
        exit_on_repl_exit: true
    },

    socket_server: {
        port: 8888
    },

    web_server: {
        port: 8080,
        path: 'client'
    },

    game: {
        default_fps: 1000/60 // 60fps
    }
};