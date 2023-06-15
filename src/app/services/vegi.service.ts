import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { environment } from 'src/environments/environment';
import {
	CheckedProducto,
	CheckedReceta,
	CrearReceta,
	PlanProducto,
	PlanReceta,
	ProductoAgregarPlan,
	RecetaAgregarPlan,
} from '../interfaces/data-types';
import { timeout, delay } from 'rxjs/operators';
import { JwtHelperService } from '@auth0/angular-jwt';
@Injectable({
	providedIn: 'root',
})
export class VegiService {
	constructor(private http: HttpClient) {}

	helper = new JwtHelperService();

	isLoggedIn: boolean = false;

	private loginSubject: BehaviorSubject<boolean> =
		new BehaviorSubject<boolean>(this.isLoggedIn);

	public login$: Observable<boolean> = this.loginSubject.asObservable();

	private HttpOptions = {
		headers: new HttpHeaders({
			token: localStorage.getItem('session') || '',
		}),
	};

	private msTimeout = 60000;

	async setHttpOptions() {
		this.HttpOptions = {
			headers: new HttpHeaders({
				token: localStorage.getItem('session') || '',
				'Access-Control-Allow-Origin': '*',
				'Access-Control-Allow-Headers': 'Content-Type',
				'Access-Control-Allow-Methods': 'GET,POST,DELETE,PUT',
			}),
		};
	}

	logout() {
		localStorage.removeItem('session');
		this.isLoggedIn = false;
		window.location.reload();
	}

	loggedIn(): any {
		const token = localStorage.getItem('session') ?? '';
		if (this.helper.isTokenExpired(token) == true) {
			this.logout;
			return false;
		}

		if (this.isLoggedIn == false) {
			this.loginSubject.next(true);
			this.isLoggedIn = true;
			return true;
		}
	}

	mockHttp = {
		get: () => {
			return of('Respuesta simulada').pipe(delay(25000));
		},
	};

	// GET
	obtenerFavoritos(): Observable<any> {
		return this.http
			.get(
				`${environment.baseUrl}/usuario/obtenerFavoritos`,
				this.HttpOptions
			)
			.pipe(timeout(this.msTimeout));
	}

	obtenerRecetasUsuario(): Observable<any> {
		return this.http
			.get(
				`${environment.baseUrl}/recetas/recetasUsuario`,
				this.HttpOptions
			)
			.pipe(timeout(this.msTimeout));
	}

	buscarProducto(producto: string): Observable<any> {
		return this.http
			.get(
				`${environment.baseUrl}/producto/buscarProducto/${producto}`,
				this.HttpOptions
			)
			.pipe(timeout(this.msTimeout));
	}

	buscarReceta(receta: string): Observable<any> {
		return this.http
			.get(
				`${environment.baseUrl}/recetas/buscarReceta/${receta}`,
				this.HttpOptions
			)
			.pipe(timeout(this.msTimeout));
	}

	obtenerInformacionProducto(id_producto: string): Observable<any> {
		return this.http
			.get(
				`${environment.baseUrl}/producto/informacionNutricionalProductoSimple/${id_producto}`,
				this.HttpOptions
			)
			.pipe(timeout(this.msTimeout));
	}

	obtenerInformacionReceta(id_receta: string): Observable<any> {
		return this.http
			.get(
				`${environment.baseUrl}/recetas/detalleReceta/${id_receta}`,
				this.HttpOptions
			)
			.pipe(timeout(this.msTimeout));
	}

	obtenerUnidadesMedidaProducto(id_producto: number): Observable<any> {
		return this.http
			.get(
				`${environment.baseUrl}/producto/obtenerUnidadesMedida/${id_producto}`,
				this.HttpOptions
			)
			.pipe(timeout(this.msTimeout));
	}

	obtenerPlanificacion(fecha: string): Observable<any> {
		return this.http
			.get(
				`${environment.baseUrl}/plan/obtenerPlanAlimentacion/:${fecha}`,
				this.HttpOptions
			)
			.pipe(timeout(this.msTimeout));
	}

	obtenerInformacionUsuario(): Observable<any> {
		return this.http
			.get(`${environment.baseUrl}/usuario/infoUsuario`, this.HttpOptions)
			.pipe(timeout(this.msTimeout));
	}

	obtenerRecomendacion(fecha: string): Observable<any> {
		return this.http
			.get(
				`${environment.recomendacionUrl}/recomendacion/:${fecha}`,
				this.HttpOptions
			)
			.pipe(timeout(this.msTimeout * 2));
	}

	// POST
	login(usuario: Object): Observable<any> {
		localStorage.removeItem('session');
		return this.http
			.post(`${environment.baseUrl}/usuario/loginUsuario`, usuario)
			.pipe(timeout(this.msTimeout));
	}

	crearUsuario(usuario: any): Observable<any> {
		return this.http
			.post(`${environment.baseUrl}/usuario/registrarUsuario`, usuario)
			.pipe(timeout(this.msTimeout));
	}

	agregarFavoritoProducto(id_producto: number): Observable<any> {
		return this.http
			.post(
				`${environment.baseUrl}/usuario/agregarFavoritoProducto/${id_producto}`,
				{},
				this.HttpOptions
			)
			.pipe(timeout(this.msTimeout));
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
		return this.http
			.post(
				`${environment.baseUrl}/plan/generarPlanProducto`,
				producto,
				this.HttpOptions
			)
			.pipe(timeout(this.msTimeout));
	}

	agregarRecetaPlanificacion(receta: RecetaAgregarPlan): Observable<any> {
		return this.http
			.post(
				`${environment.baseUrl}/plan/generarPlanPreparacion`,
				receta,
				this.HttpOptions
			)
			.pipe(timeout(this.msTimeout));
	}

	crearReceta(receta: CrearReceta): Observable<any> {
		return this.http
			.post(
				`${environment.baseUrl}/recetas/crearReceta`,
				receta,
				this.HttpOptions
			)
			.pipe(timeout(this.msTimeout));
	}

	guardarFotoReceta(fotoReceta: any): Observable<any> {
		return this.http
			.post(
				`${environment.baseUrl}/recetas/guardarFotos`,
				fotoReceta,
				this.HttpOptions
			)
			.pipe(timeout(this.msTimeout));
	}

	// DELETE
	quitarFavoritoProducto(id_producto: number): Observable<any> {
		return this.http
			.delete(
				`${environment.baseUrl}/usuario/quitarFavoritoProducto/${id_producto}`,
				this.HttpOptions
			)
			.pipe(timeout(this.msTimeout));
	}

	quitarFavoritoReceta(id_receta: number): Observable<any> {
		return this.http
			.delete(
				`${environment.baseUrl}/usuario/quitarFavoritoPreparacion/${id_receta}`,
				this.HttpOptions
			)
			.pipe(timeout(this.msTimeout));
	}

	eliminarPlanProducto(id_plan_producto: number): Observable<any> {
		return this.http
			.delete(
				`${environment.baseUrl}/plan/eliminarPlanProducto/${id_plan_producto}`,
				this.HttpOptions
			)
			.pipe(timeout(this.msTimeout));
	}

	eliminarPlanReceta(id_plan_preparacion: number): Observable<any> {
		return this.http
			.delete(
				`${environment.baseUrl}/plan/eliminarPlanPreparacion/${id_plan_preparacion}`,
				this.HttpOptions
			)
			.pipe(timeout(this.msTimeout));
	}

	eliminarReceta(id_receta: number): Observable<any> {
		return this.http
			.delete(
				`${environment.baseUrl}/recetas/eliminarReceta/${id_receta}`,
				this.HttpOptions
			)
			.pipe(timeout(this.msTimeout));
	}

	// PUT
	marcarCheckedPlanProducto(
		checkedProducto: CheckedProducto
	): Observable<any> {
		return this.http
			.put(
				`${environment.baseUrl}/plan/marcarCheckedPlanProducto`,
				checkedProducto,
				this.HttpOptions
			)
			.pipe(timeout(this.msTimeout));
	}

	marcarCheckedPlanReceta(checkedReceta: CheckedReceta): Observable<any> {
		return this.http
			.put(
				`${environment.baseUrl}/plan/marcarCheckedPlanPreparacion`,
				checkedReceta,
				this.HttpOptions
			)
			.pipe(timeout(this.msTimeout));
	}

	editarPlanProducto(planProducto: PlanProducto): Observable<any> {
		return this.http
			.put(
				`${environment.baseUrl}/plan/editarPlanProducto`,
				planProducto,
				this.HttpOptions
			)
			.pipe(timeout(this.msTimeout));
	}

	editarPlanPreparacion(planReceta: PlanReceta): Observable<any> {
		return this.http.put(
			`${environment.baseUrl}/plan/editarPlanPreparacion`,
			planReceta,
			this.HttpOptions
		);
	}

	editarInformacionUsuario(informacionUsuario: any): Observable<any> {
		return this.http
			.put(
				`${environment.baseUrl}/usuario/editarInformacion`,
				informacionUsuario,
				this.HttpOptions
			)
			.pipe(timeout(this.msTimeout));
	}

	correoExiste(correo:any): Observable<any>{
		return this.http
		.get(
			`${environment.baseUrl}/usuario/existeCorreo/${correo}`,
			this.HttpOptions
		)
		.pipe(timeout(this.msTimeout));
	}
}
