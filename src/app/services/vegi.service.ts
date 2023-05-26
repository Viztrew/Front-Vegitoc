import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import {
	ProductoAgregarPlan,
	RecetaAgregarPlan,
} from '../interfaces/data-types';
import { timeout } from 'rxjs/operators';

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

	// GET
	obtenerFavoritos(): Observable<any> {
		return this.http
			.get(
				`${environment.baseUrl}/usuario/obtenerFavoritos`,
				this.HttpOptions
			)
			.pipe(timeout(10000));
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

	obtenerInformacionProducto(id_producto: number): Observable<any> {
		return this.http.get(
			`${environment.baseUrl}/producto/informacionNutricionalProductoSimple/${id_producto}`,
			this.HttpOptions
		);
	}

	obtenerInformacionReceta(id_receta: number): Observable<any> {
		return this.http.get(
			`${environment.baseUrl}/recetas/detalleReceta/${id_receta}`,
			this.HttpOptions
		);
	}

	obtenerUnidadesMedidaProducto(id_producto: number): Observable<any> {
		return this.http.get(
			`${environment.baseUrl}/producto/obtenerUnidadesMedida/${id_producto}`,
			this.HttpOptions
		);
	}

	obtenerPlanificacion(fecha: string): Observable<any> {
		return this.http.get(
			`${environment.baseUrl}/plan/obtenerPlanAlimentacion/:${fecha}`,
			this.HttpOptions
		);
	}

	// POST
	login(usuario: Object): Observable<any> {
		return this.http.post(
			`${environment.baseUrl}/usuario/loginUsuario`,
			usuario
		);
	}

	agregarFavoritoProducto(id_producto: number): Observable<any> {
		return this.http.post(
			`${environment.baseUrl}/usuario/agregarFavoritoProducto/${id_producto}`,
			{},
			this.HttpOptions
		);
	}

	agregarFavoritoReceta(id_receta: number): Observable<any> {
		return this.http.post(
			`${environment.baseUrl}/usuario/agregarFavoritoPreaparacion/${id_receta}`,
			{},
			this.HttpOptions
		);
	}

	agregarProductoPlanificacion(
		producto: ProductoAgregarPlan
	): Observable<any> {
		return this.http.post(
			`${environment.baseUrl}/plan/generarPlanProducto`,
			producto,
			this.HttpOptions
		);
	}

	agregarRecetaPlanificacion(receta: RecetaAgregarPlan): Observable<any> {
		return this.http.post(
			`${environment.baseUrl}/plan/generarPlanPreparacion`,
			receta,
			this.HttpOptions
		);
	}

	// DELETE
	quitarFavoritoProducto(id_producto: number): Observable<any> {
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

	// PUT
	marcarCheckedPlanProducto(id_plan_producto: bigint): Observable<any> {
		let checked: {};
		return this.http.put(
			`${environment.baseUrl}/plan/marcarCheckedPlanProducto${id_plan_producto}`,
			this.HttpOptions
		);
	}
}
