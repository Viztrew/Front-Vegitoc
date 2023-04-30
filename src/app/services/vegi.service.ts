import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
	providedIn: 'root',
})
export class VegiService {
	constructor(private http: HttpClient) {}

	HttpOptions = {
		headers: new HttpHeaders({
			token: localStorage.getItem('session') || '',
		}),
	};

	login(usuario: Object): Observable<any> {
		return this.http.post(
			`${environment.baseUrl}/usuario/loginUsuario`,
			usuario, {observe: 'response'}
		);
	}

	obtenerProductos(): Observable<any> {
		return this.http.get(
			`${environment.baseUrl}/producto/listaCompletaProductos`,
			this.HttpOptions
		);
	}

	buscarProducto(producto: string): Observable<any> {
		return this.http.get(
			`${environment.baseUrl}/producto/busquedaSimilitudes/${producto}`,
			this.HttpOptions
		);
	}
}
