import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MapResponseInterface } from '../interfaces/map-response.interface';

@Injectable( {
    providedIn: 'root'
} )
export class MapService {

    constructor( private http: HttpClient ) { }

    getMaps() {
        return this.http.get<MapResponseInterface>( 'http://localhost:3000/api/map' );
    }
}
