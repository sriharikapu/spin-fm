const WebSocket = require('ws')

const P2P_PORT = process.env.P2P_PORT || 5001
const peers = process.env.PEERS ? process.env.PEERS.split(',') : []
// HTTP_PORT=3002 P2P_PORT=5003 npm run dev
// HTTP_PORT=3002 P2P_PORT=5003 PEERS=ws://10.0.1.28:5003, npm run dev
// HTTP_PORT=3002 P2P_PORT=5003 PEERS=ws://10.0.1.28:5003, ws://10.0.0.222:5003 npm run dev
// HTTP_PORT=3002 P2P_PORT=5003 PEERS=ws://10.0.1.28:5003, ws://10.0.0.208:5003 npm run dev
// HTTP_PORT=3002 P2P_PORT=5003 PEERS=ws://localhost:5003, ws://localhost:5003 npm run dev

class P2PServer {
  constructor(metadata) {
    this.metadata   = metadata
    this.sockets    = []
    this.server     = null
  }

  listen() {
    this.server = new WebSocket.Server({ port: P2P_PORT})
    this.server.on('connection', (socket) => this.connectSocket(socket))

    this.connectToPeers()
    console.log(`Listening for peer-to-peer connetions on: ${P2P_PORT}`)

    const interval = setInterval(() => {
      this.server.clients.forEach(function each(socket) {
        if (socket.isAlive === false) return socket.terminate();
     
        socket.isAlive = false;
        socket.ping(() => {console.log('Pinging...')});
      });
    }, 5000);
  }

  connectToPeers() {
    peers.forEach(peer => {
      // ws://localhost:5001 // example
      const socket = new WebSocket(peer)
      socket.on('open', () => this.connectSocket(socket))
    })
  }
 
  heartbeat() {
    this.isAlive = true;
    console.log('\tHEARTBEAT..')
  }

  connectSocket(socket) {
    // this.sockets.push(socket)
    console.log('Socket connected')
    socket.isAlive = true
    socket.on('pong', this.heartbeat);

    this.messageHandler(socket)
    this.sendMetadata(socket)
  }

  messageHandler(socket) {
    socket.on('message', (message) => {
      const data = JSON.parse(message)
      console.log('data', data)
      // this.roomMetadata.replaceMetadata(data)
    })
  }

  sendMetadata(socket) {
    socket.send(JSON.stringify(this.metadata)) // could send array/binary-data
  }

  syncMetadata() {
    this.server.clients.forEach(socket => {
      this.sendMetata(socket)
    })
  }
}

module.exports = P2PServer