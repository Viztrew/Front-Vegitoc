import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import {
	ProductoAgregarPlan,
	RecetaAgregarPlan,
} from '../interfaces/data-types';

@Injectable({
	providedIn: 'root',
})
export class ComponentsService {
	producto = {} as ProductoAgregarPlan;

	private productos: BehaviorSubject<ProductoAgregarPlan> =
		new BehaviorSubject<ProductoAgregarPlan>(this.producto);

	receta = {} as RecetaAgregarPlan;

	private recetas: BehaviorSubject<RecetaAgregarPlan> =
		new BehaviorSubject<RecetaAgregarPlan>(this.receta);

	constructor() {}

	//observables para componente planificacion
	public recetas$: Observable<RecetaAgregarPlan> =
		this.recetas.asObservable();

	public productos$: Observable<ProductoAgregarPlan> =
		this.productos.asObservable();

	//se añade el producto a agregar a la lista de productos
	public addProducto(producto: ProductoAgregarPlan): void {
		this.productos.next(producto);
	}

	public addReceta(receta: RecetaAgregarPlan): void {
		this.recetas.next(receta);
	}
}
