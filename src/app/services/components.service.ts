import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import {
	Ingrediente,
	Producto,
	ProductoAgregarPlan,
	Receta,
	RecetaAgregarPlan,
} from '../interfaces/data-types';

@Injectable({
	providedIn: 'root',
})
export class ComponentsService {
	productoFavorito = {} as Producto;

	private productosFavoritos: BehaviorSubject<Producto> =
		new BehaviorSubject<Producto>(this.productoFavorito);

	recetaFavorito = {} as Receta;

	private recetasFavoritos: BehaviorSubject<Receta> =
		new BehaviorSubject<Receta>(this.recetaFavorito);

	producto = {} as ProductoAgregarPlan;

	private productos: BehaviorSubject<ProductoAgregarPlan> =
		new BehaviorSubject<ProductoAgregarPlan>(this.producto);

	receta = {} as RecetaAgregarPlan;

	private recetas: BehaviorSubject<RecetaAgregarPlan> =
		new BehaviorSubject<RecetaAgregarPlan>(this.receta);

	ingredienteReceta = {} as Ingrediente;

	private ingredienteRecetas: BehaviorSubject<Ingrediente> =
		new BehaviorSubject<Ingrediente>(this.ingredienteReceta);

	constructor() {}

	//observables para componente buscar
	public productosFavoritos$: Observable<Producto> =
		this.productosFavoritos.asObservable();

	public recetasFavoritos$: Observable<Receta> =
		this.recetasFavoritos.asObservable();

	//observables para componente planificacion
	public recetas$: Observable<RecetaAgregarPlan> =
		this.recetas.asObservable();

	public productos$: Observable<ProductoAgregarPlan> =
		this.productos.asObservable();

	public ingredienteRecetas$: Observable<Ingrediente> =
		this.ingredienteRecetas.asObservable();

	//se añade el producto a agregar a la lista de productos favoritos
	public addProductoFavorito(producto: Producto): void {
		this.productosFavoritos.next(producto);
	}

	//se añade la receta a agregar a la lista de recetas favoritos
	public addRecetaFavorito(receta: Receta): void {
		this.recetasFavoritos.next(receta);
	}

	//se añade el producto a agregar a la lista de productos
	public addProducto(producto: ProductoAgregarPlan): void {
		this.productos.next(producto);
	}

	//se añade la receta a agregar a la lista de recetas
	public addReceta(receta: RecetaAgregarPlan): void {
		this.recetas.next(receta);
	}

	public addIngredienteReceta(ingrediente: Ingrediente): void {
		this.ingredienteRecetas.next(ingrediente);
	}
}
