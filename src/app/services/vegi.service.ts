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
			usuario
		);
	}

	obtenerFavoritos(): Observable<any> {
		return this.http.get(
			`${environment.baseUrl}/usuario/obtenerFavoritos`,
			this.HttpOptions
		);
	}

	obtenerRecetasUsuario(): Observable<any> {
		return this.http.get(
			`${environment.baseUrl}/recetas/recetasUsuario`,
			this.HttpOptions
		);
	}

	buscarProducto(producto: string): Observable<any> {
		return this.http.get(
			`${environment.baseUrl}/producto/buscarProducto/${producto}`,
			this.HttpOptions
		);
	}

	buscarReceta(receta: string): Observable<any> {
		return this.http.get(
			`${environment.baseUrl}/recetas/buscarReceta/${receta}`,
			this.HttpOptions
		);
	}

	obtenerInformacionProducto(id_producto: bigint): Observable<any> {
		return this.http.get(
			`${environment.baseUrl}/producto/informacionNutricionalProductoSimple/${id_producto}`,
			this.HttpOptions
		);
	}
	obtenerInformacionReceta(id_receta: bigint): Observable<any> {
		return this.http.get(
			`${environment.baseUrl}/recetas/detalleReceta/${id_receta}`,
			this.HttpOptions
		);
	}

	agregarFavoritoProducto(id_producto: bigint): Observable<any> {
		return this.http.post(
			`${environment.baseUrl}/usuario/agregarFavoritoProducto/${id_producto}`,
			{},
			this.HttpOptions
		);
	}

	agregarFavoritoReceta(id_receta: bigint): Observable<any> {
		return this.http.post(
			`${environment.baseUrl}/usuario/agregarFavoritoPreaparacion/${id_receta}`,
			{},
			this.HttpOptions
		);
	}

	quitarFavoritoProducto(id_producto: bigint): Observable<any> {
		return this.http.delete(
			`${environment.baseUrl}/usuario/quitarFavoritoProducto/${id_producto}`,
			this.HttpOptions
		);
	}

	quitarFavoritoReceta(id_receta: bigint): Observable<any> {
		return this.http.delete(
			`${environment.baseUrl}/usuario/quitarFavoritoPreparacion/${id_receta}`,
			this.HttpOptions
		);
	}
}
