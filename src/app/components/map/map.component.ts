import { Component, OnInit } from '@angular/core';
import * as mapboxgl from 'mapbox-gl';
import { LugarInterface } from '../../interfaces/lugar.interface';

@Component( {
    selector: 'app-map',
    templateUrl: './map.component.html',
    styleUrls: ['./map.component.css']
} )
export class MapComponent implements OnInit {

    map: mapboxgl.Map;
    lugares: LugarInterface[] = [
        {
            id: '1',
            nombre: 'Fernando',
            lng: -75.75512993582937,
            lat: 45.349977429009954,
            color: '#DD8FEE'
        },
        {
            id: '2',
            nombre: 'Amy',
            lng: -75.75195645527508,
            lat: 45.351584045823756,
            color: '#790AF0'
        },
        {
            id: '3',
            nombre: 'Orlando',
            lng: -75.75900589557777,
            lat: 45.34794635758547,
            color: '#19884B'
        }
    ];

    constructor() { }

    ngOnInit() {
        this.createMap();
    }

    createMap() {
        ( mapboxgl as any ).accessToken = 'pk.eyJ1IjoiYWx2YTg1IiwiYSI6ImNrN2k2aDk0aTBpMjIzbG5rYTBtdXd5ZDYifQ.ZiY4qp3j3xfn8KlNJg4cZQ';
        this.map = new mapboxgl.Map( {
            container: 'map',
            style: 'mapbox://styles/mapbox/streets-v11',
            center: [-75.75512993582937, 45.349977429009954],
            zoom: 15.8
        } );

        this.lugares.forEach( x => this.addMarkers( x ) );
    }

    addMarkers( marker: LugarInterface ) {

        const html = `<h2>${marker.nombre}</h2>
                      <br>
                       <button>Borrar</button>`;

        const popup = new mapboxgl.Popup( {
            offset: 25,
            closeOnClick: false
        } ).setHTML( html );

        const mk = new mapboxgl.Marker( {
            draggable: true,
            color: marker.color
        } )
        .setLngLat( [marker.lng, marker.lat] )
        .setPopup( popup )
        .addTo( this.map );
    }

}
