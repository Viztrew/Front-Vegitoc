import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { ProductoAgregarPlan } from '../interfaces/data-types';

@Injectable({
	providedIn: 'root',
})
export class ComponentsService {
	producto = {} as ProductoAgregarPlan;

	private productos: BehaviorSubject<ProductoAgregarPlan> =
		new BehaviorSubject<ProductoAgregarPlan>(this.producto);

	constructor() {}

	public productos$: Observable<ProductoAgregarPlan> =
		this.productos.asObservable();

	public addProducto(producto: ProductoAgregarPlan): void {
		this.productos.next(producto);
	}
}
