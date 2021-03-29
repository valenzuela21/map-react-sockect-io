const Markers = require('./Markers');
const Marker = require('./Marker');
class Sockets {

    constructor( io ) {

        this.io = io;

        this.markers =  new Markers();

        this.marker = new Marker();

        this.socketEvents();
    }

    socketEvents() {
        // On connection
        this.io.on('connection', ( socket ) => {
                    console.log('This connect!')
                    //TODO: markers-actives
                    socket.emit('markers-actives', this.markers.actives);

                    //TODO: marker-new
                    socket.on('marker-new', (marker)=>{
                        this.markers.addMarker(marker);
                        socket.broadcast.emit('marker-new', marker);
                    });

                    //TODO: marker-update
                    socket.on('marker-update', (marker)=>{
                       this.markers.updateMarker(marker);
                       socket.broadcast.emit('marker-update', marker);
                    })
        
        });
    }


}


module.exports = Sockets;