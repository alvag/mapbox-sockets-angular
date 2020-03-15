import { Component, OnInit } from '@angular/core';
import * as mapboxgl from 'mapbox-gl';
import { MarkerInterface } from '../../interfaces/markerInterface';
import { WebsocketService } from '../../services/websocket.service';
import { MapService } from '../../services/map.service';
import { MapResponseInterface } from '../../interfaces/map-response.interface';

@Component( {
    selector: 'app-map',
    templateUrl: './map.component.html',
    styleUrls: ['./map.component.css']
} )
export class MapComponent implements OnInit {

    map: mapboxgl.Map;
    markers: MapResponseInterface = {};
    markersMapbox: { [ id: string ]: mapboxgl.Marker } = {};

    constructor( private wsService: WebsocketService,
                 private mapService: MapService ) { }

    ngOnInit() {
        this.getMarkers();
        this.listenSockets();
    }

    listenSockets() {
        this.wsService.listen( 'add-marker' )
        .subscribe( ( marker: MarkerInterface ) => this.addMarkers( marker ) );

        this.wsService.listen( 'delete-marker' ).subscribe( ( id: string ) => this.deleteMarker( id ) );

        this.wsService.listen( 'move-marker' )
        .subscribe( ( marker: MarkerInterface ) => this.moveMarker( marker ) );
    }

    getMarkers() {
        this.mapService.getMaps().subscribe( markers => {
            console.log( markers );
            this.markers = markers;
            this.createMap();

        } );
    }

    createMap() {
        ( mapboxgl as any ).accessToken = 'pk.eyJ1IjoiYWx2YTg1IiwiYSI6ImNrN2k2aDk0aTBpMjIzbG5rYTBtdXd5ZDYifQ.ZiY4qp3j3xfn8KlNJg4cZQ';
        this.map = new mapboxgl.Map( {
            container: 'map',
            style: 'mapbox://styles/mapbox/streets-v11',
            center: [-75.75512993582937, 45.349977429009954],
            zoom: 15.8
        } );

        Object.entries( this.markers ).forEach( ( [key, marker] ) => this.addMarkers( marker ) );

    }

    addMarkers( marker: MarkerInterface ) {

        const h2 = document.createElement( 'h2' );
        h2.innerText = marker.name;

        const btn = document.createElement( 'button' );
        btn.innerText = 'Borrar';

        const div = document.createElement( 'div' );
        div.append( h2, btn );

        const popup = new mapboxgl.Popup( {
            offset: 25,
            closeOnClick: false
        } ).setDOMContent( div );

        const mk = new mapboxgl.Marker( {
            draggable: true,
            color: marker.color
        } )
        .setLngLat( [marker.lng, marker.lat] )
        .setPopup( popup )
        .addTo( this.map );

        mk.on( 'drag', () => {
            const lngLat = mk.getLngLat();
            marker.lat = lngLat.lat;
            marker.lng = lngLat.lng;
            this.wsService.emit( 'move-marker', marker );
        } );

        btn.addEventListener( 'click', () => {
            mk.remove();
            console.log( marker );
            this.wsService.emit( 'delete-marker', marker.id );
        } );

        this.markersMapbox[ marker.id ] = mk;

    }

    createMarker() {
        const mk: MarkerInterface = {
            id: new Date().toISOString(),
            lng: -75.75512993582937,
            lat: 45.349977429009954,
            name: 'Sin nombre',
            color: '#' + Math.floor( Math.random() * 16777215 ).toString( 16 )
        };

        this.addMarkers( mk );

        this.wsService.emit( 'add-marker', mk );
    }

    deleteMarker( id: string ) {
        delete this.markers[ id ];
        this.markersMapbox[ id ].remove();
    }

    moveMarker( marker: MarkerInterface ) {
        this.markersMapbox[ marker.id ].setLngLat( [marker.lng, marker.lat] );
    }
}
