import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import {
	CheckedProducto,
	CheckedReceta,
	PlanProducto,
	PlanReceta,
	ProductoAgregarPlan,
	RecetaAgregarPlan,
} from '../interfaces/data-types';
import { timeout } from 'rxjs/operators';
import { JwtHelperService } from "@auth0/angular-jwt";
import { Router } from '@angular/router';
import { Location } from '@angular/common';

@Injectable({
	providedIn: 'root',
})
export class VegiService {
	constructor(private http: HttpClient,private router: Router, private location: Location) {}
	helper = new JwtHelperService();
	isLoggedIn:boolean = false;

	logout() {
		localStorage.removeItem('session');
		this.isLoggedIn = false;
		this.router.navigate(['']);
		window.location.reload();
	}
	  
	loggedIn():any {
		const token =  localStorage.getItem('session') ?? '';
		if (this.helper.isTokenExpired(token) == true) {
		  this.logout;
		  return false
		}

		if(this.isLoggedIn == false){
			this.isLoggedIn = true;
		}
		
	}

	private HttpOptions = {
		headers: new HttpHeaders({
			token: localStorage.getItem('session') || '',
		}),
	};

	async setHttpOptions() {
		this.HttpOptions = {
			headers: new HttpHeaders({
				token: localStorage.getItem('session') || '',
			}),
		};
	}

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

	obtenerInformacionUsuario(): Observable<any>{
		return this.http.get(
			`${environment.baseUrl}/usuario/infoUsuario`,
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

	crearUsuario(usuario: any): Observable<any> {
		return this.http.post(
			`${environment.baseUrl}/usuario/registrarUsuario`,
			usuario,
			this.HttpOptions
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

	quitarFavoritoReceta(id_receta: number): Observable<any> {
		return this.http.delete(
			`${environment.baseUrl}/usuario/quitarFavoritoPreparacion/${id_receta}`,
			this.HttpOptions
		);
	}

	eliminarPlanProducto(id_plan_producto: number): Observable<any> {
		return this.http.delete(
			`${environment.baseUrl}/plan/eliminarPlanProducto/${id_plan_producto}`,
			this.HttpOptions
		);
	}

	eliminarPlanReceta(id_plan_preparacion: number): Observable<any> {
		return this.http.delete(
			`${environment.baseUrl}/plan/eliminarPlanPreparacion/${id_plan_preparacion}`,
			this.HttpOptions
		);
	}

	// PUT
	marcarCheckedPlanProducto(
		checkedProducto: CheckedProducto
	): Observable<any> {
		return this.http.put(
			`${environment.baseUrl}/plan/marcarCheckedPlanProducto`,
			checkedProducto,
			this.HttpOptions
		);
	}

	marcarCheckedPlanReceta(checkedReceta: CheckedReceta): Observable<any> {
		return this.http.put(
			`${environment.baseUrl}/plan/marcarCheckedPlanPreparacion`,
			checkedReceta,
			this.HttpOptions
		);
	}

	editarPlanProducto(planProducto: PlanProducto): Observable<any> {
		return this.http.put(
			`${environment.baseUrl}/plan/editarPlanProducto`,
			planProducto,
			this.HttpOptions
		);
	}

	editarPlanPreparacion(planReceta: PlanReceta): Observable<any> {
		return this.http.put(
			`${environment.baseUrl}/plan/editarPlanPreparacion`,
			planReceta,
			this.HttpOptions
		);
	}
}
