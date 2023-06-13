import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription, TimeoutError } from 'rxjs';
import {
	ProductoAgregarPlan,
	ProductoRecomendado,
	RecetaRecomendada,
} from 'src/app/interfaces/data-types';
import { VegiService } from 'src/app/services/vegi.service';
import { environment } from 'src/environments/environment';
import { MessageService } from 'primeng/api';

@Component({
	selector: 'app-dialog-recomendacion',
	templateUrl: './dialog-recomendacion.component.html',
	styleUrls: ['./dialog-recomendacion.component.scss'],
})
export class DialogRecomendacionComponent {
	constructor(
		private servicio: VegiService,
		private router: Router,
		private messageService: MessageService
	) {}

	@Input() momento_dia!: string;

	@Input() dia!: string;

	@Input() fecha!: string;

	@Input() visible!: boolean;

	@Output() cancelarRecomendacionEvent = new EventEmitter<any>();

	@Output() recomendacionConfirmadaEvent = new EventEmitter<any>();

	private suscripcionRecomendacion!: Subscription;

	imgRecetaUrl = environment.baseUrl;

	titulo!: string;

	mostrarSpinnerBuscar: boolean = true;

	productosRecomendados!: Array<ProductoRecomendado>;

	recetasRecomendadas!: Array<RecetaRecomendada>;

	estadoProductosRecomendados!: Array<ProductoAgregarPlan>;

	ngOnInit() {
		console.log(this.estadoProductosRecomendados);

		this.titulo = 'Recomendación para ' + this.dia;

		this.mostrarSpinnerBuscar = true;

		this.obtenerRecomendacion();
	}

	obtenerRecomendacion() {
		console.log('recomendacion');
		this.suscripcionRecomendacion = this.servicio
			.obtenerRecomendacion(this.fecha)
			.subscribe(
				(data) => {
					console.log(data);
					this.mostrarSpinnerBuscar = false;
					if (data.is_valid) {
						if (data.productos) {
							this.productosRecomendados = data.productos;
						} else {
							this.productosRecomendados = [];
						}

						if (data.recetas) {
							this.recetasRecomendadas = data.recetas;
						} else {
							this.recetasRecomendadas = [];
						}
					}
				},
				(err) => {
					this.visible = false;
					if (err.status == 401) {
						this.router.navigateByUrl('login');
						this.messageService.clear();
						this.messageService.add({
							severity: 'error',
							summary: 'Sesión caducada',
							detail: 'Inicia sesión nuevamente',
							life: 3000,
						});
					} else if (err.status == 0) {
						this.messageService.clear();
						this.messageService.add({
							severity: 'error',
							summary: 'Sin conexión',
							detail: 'No se pudo conectar con el servidor',
							life: 3000,
						});
					} else if (err instanceof TimeoutError) {
						this.messageService.clear();
						this.messageService.add({
							severity: 'error',
							summary: 'Timeout',
							detail: 'Se excedió el tiempo de espera máximo de respuesta',
							life: 3000,
						});
					} else {
						this.messageService.clear();
						this.messageService.add({
							severity: 'error',
							summary: 'Error desconocido',
							detail: 'Se produjo un error desconocido, intente nuevamente.',
							life: 3000,
						});
					}
				}
			);
	}

	guardarEstadosProductos(producto: any) {
		let estadoProducto: ProductoAgregarPlan = {
			fecha: this.fecha,
			dia: this.dia,
			momento_dia: producto.momento_dia.nombre,
			id_producto: producto.producto.id_producto,
			nombre: producto.producto.nombre,
			unidad_medida: 1,
			nombre_unidad: producto.producto.nombre_unidad,
			cantidad: producto.producto.cantidad,
			kcal: producto.producto.kcal,
			checked: false,
		};
		if (this.estadoProductosRecomendados == undefined) {
			this.estadoProductosRecomendados = [estadoProducto];
		} else {
			let repetido = false;
			for (let i = 0; i < this.estadoProductosRecomendados.length; i++) {
				if (
					producto.producto.id_producto ==
					this.estadoProductosRecomendados[i].id_producto
				) {
					this.estadoProductosRecomendados.splice(i, 1);
					repetido = true;
					break;
				}
			}
			if (!repetido) {
				this.estadoProductosRecomendados.push(estadoProducto);
			}
		}
	}

	cancelarRecomendacion() {
		this.suscripcionRecomendacion.unsubscribe();
		this.visible = false;
	}

	confirmarRecomendacion() {
		console.log(this.estadoProductosRecomendados);
		this.recomendacionConfirmadaEvent.emit(
			this.estadoProductosRecomendados
		);
		this.visible = false;
	}

	ngOnDestroy() {
		this.cancelarRecomendacion();
	}
}
