import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
@Injectable({
	providedIn: 'root',
})
export class VegiService {
	constructor(private http: HttpClient) {}

	login(usuario: Object): Observable<any> {
		return this.http.post(
			`http://ec2-107-23-75-98.compute-1.amazonaws.com:3000/usuario/loginUsuario`,
			usuario
		);
	}

	buscarProducto(producto: string, token: string): Observable<any> {
		let HttpOptions = {
			headers: new HttpHeaders({
				token: token,
			}),
		};

		console.log(token);

		return this.http.get(
			`http://ec2-107-23-75-98.compute-1.amazonaws.com:3000/producto/busquedaSimilitudes/${producto}`,
			HttpOptions
		);
	}
}
