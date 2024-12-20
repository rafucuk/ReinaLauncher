"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMainServer = getMainServer;
function getMainServer(servers) {
    const mainServer = servers.find(({ mainServer }) => mainServer);
    if (mainServer == null && servers.length > 0) {
        return servers[0];
    }
    return mainServer;
}
