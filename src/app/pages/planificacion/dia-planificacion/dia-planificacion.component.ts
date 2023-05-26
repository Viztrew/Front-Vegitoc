import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { MessageService } from 'primeng/api';
import { Subscription } from 'rxjs';
import {
	ProductoAgregarPlan,
	Planificacion,
	RecetaAgregarPlan,
	CheckedProducto,
	CheckedReceta,
} from 'src/app/interfaces/data-types';
import { ComponentsService } from 'src/app/services/components.service';
import { VegiService } from 'src/app/services/vegi.service';

@Component({
	selector: 'app-dia-planificacion',
	templateUrl: './dia-planificacion.component.html',
	styleUrls: ['./dia-planificacion.component.scss'],
})
export class DiaPlanificacionComponent implements OnInit, OnDestroy {
	constructor(
		private servicioComponentes: ComponentsService,
		private servicio: VegiService,
		private router: Router,
		private messageService: MessageService,
		private spinner: NgxSpinnerService
	) {}
	@Input() dia!: string;

	Planificacion!: Planificacion;

	momentosDia = ['DESAYUNO', 'ALMUERZO', 'CENA'];

	checked: boolean = false;

	productoSubscription!: Subscription;

	recetaSubscription!: Subscription;

	ngOnInit(): void {
		this.obtenerPlanificacion();

		this.productoSubscription =
			this.servicioComponentes.productos$.subscribe((data) => {
				if (data.dia?.toLowerCase() == this.dia.toLowerCase()) {
					let producto = data;
					producto.fecha = this.obtenerFecha(producto.dia);
					producto.checked = false;
					this.agregarProductoPlanificacion(producto);
				}
			});

		this.recetaSubscription = this.servicioComponentes.recetas$.subscribe(
			(data) => {
				if (data.dia?.toLowerCase() == this.dia.toLowerCase()) {
					let receta = data;
					receta.fecha = this.obtenerFecha(receta.dia);
					receta.checked = false;
					this.agregarRecetaPlanificacion(receta);
				}
			}
		);
	}

	buscarProducto(dia: string, momento: string) {
		this.router.navigateByUrl(
			'buscar/' + dia.toLowerCase() + '/' + momento.toLowerCase()
		);
	}

	async obtenerPlanificacion() {
		this.spinner.show();
		this.servicio
			.obtenerPlanificacion(this.obtenerFecha(this.dia))
			.subscribe(
				(data) => {
					this.Planificacion = data;
					this.spinner.hide();
				},
				(err) => {
					this.spinner.hide();
					if (err.status == 401) {
						this.messageService.clear();
						this.messageService.add({
							severity: 'error',
							summary: 'Sesión caducada',
							detail: 'Inicia sesión nuevamente',
							life: 3000,
						});
					} else {
						this.messageService.clear();
						if (err.status == 0) {
							this.messageService.add({
								severity: 'error',
								summary: 'Sin conexión',
								detail: 'No se pudo conectar con el servidor',
								life: 3000,
							});
						}
					}
				}
			);
	}

	obtenerFecha(dia: string) {
		let fecha = '0';
		let date = new Date();
		let year = date.getFullYear();
		let month;
		if (date.getMonth() + 1 < 10) {
			month = '0' + (date.getMonth() + 1);
		} else {
			month = date.getMonth() + 1;
		}

		if (dia.toLowerCase() == 'hoy') {
			let day = date.getDate();
			fecha = year + '-' + month + '-' + day;
		} else if (dia.toLowerCase() == 'ayer') {
			let day = date.getDate() - 1;
			fecha = year + '-' + month + '-' + day;
		} else if (dia.toLowerCase() == 'mañana') {
			let day = date.getDate() + 1;
			fecha = year + '-' + month + '-' + day;
		}
		return fecha;
	}

	async agregarProductoPlanificacion(producto: ProductoAgregarPlan) {
		this.servicioComponentes.addProducto({} as ProductoAgregarPlan);
		this.servicio.agregarProductoPlanificacion(producto).subscribe(
			(data) => {
				if (data) {
					this.obtenerPlanificacion();
					let articulo: string;
					if (producto.momento_dia.toLowerCase() == 'cena') {
						articulo = 'la';
					} else {
						articulo = 'el';
					}
					this.messageService.add({
						severity: 'success',
						summary:
							producto.nombre +
							' ha sido agregado para ' +
							articulo +
							' ' +
							producto.momento_dia +
							' de ' +
							producto.dia.toUpperCase() +
							'!',
						life: 2500,
					});
				}
			},
			(err) => {
				console.log(err);
			}
		);
	}

	async agregarRecetaPlanificacion(receta: RecetaAgregarPlan) {
		this.servicioComponentes.addReceta({} as RecetaAgregarPlan);
		this.servicio.agregarRecetaPlanificacion(receta).subscribe(
			(data) => {
				if (data) {
					let articulo: string;
					if (receta.momento_dia.toLowerCase() == 'cena') {
						articulo = 'la';
					} else {
						articulo = 'el';
					}
					this.obtenerPlanificacion();
					this.messageService.add({
						severity: 'success',
						summary:
							receta.nombre +
							' ha sido agregado para ' +
							articulo +
							' ' +
							receta.momento_dia +
							' de ' +
							receta.dia.toUpperCase() +
							'!',
						life: 2500,
					});
				}
			},
			(err) => {
				if (err.status == 401) {
					this.messageService.clear();
					this.messageService.add({
						severity: 'error',
						summary: 'Sesión caducada',
						detail: 'Inicia sesión nuevamente',
						life: 3000,
					});
				} else {
					if (err.status == 0) {
						this.messageService.clear();
						this.messageService.add({
							severity: 'error',
							summary: 'Sin conexión',
							detail: 'No se pudo conectar con el servidor',
							life: 3000,
						});
					}
				}
			}
		);
	}

	marcarCheckedPlanProducto(producto: any) {
		let checkedProducto: CheckedProducto = {
			id_plan_producto: producto.id_plan_producto,
			checked: producto.checked,
		};
		this.servicio.marcarCheckedPlanProducto(checkedProducto).subscribe(
			(data) => {},
			(err) => {
				if (err.status == 401) {
					this.messageService.clear();
					this.messageService.add({
						severity: 'error',
						summary: 'Sesión caducada',
						detail: 'Inicia sesión nuevamente',
						life: 3000,
					});
				} else {
					if (err.status == 0) {
						this.messageService.clear();
						this.messageService.add({
							severity: 'error',
							summary: 'Sin conexión',
							detail: 'No se pudo conectar con el servidor',
							life: 3000,
						});
					}
				}
			}
		);
	}

	marcarCheckedPlanReceta(receta: any) {
		let checkedReceta: CheckedReceta = {
			id_plan_preparacion: receta.id_plan_preparacion,
			checked: receta.checked,
		};
		this.servicio.marcarCheckedPlanReceta(checkedReceta).subscribe(
			(data) => {},
			(err) => {
				if (err.status == 401) {
					this.messageService.clear();
					this.messageService.add({
						severity: 'error',
						summary: 'Sesión caducada',
						detail: 'Inicia sesión nuevamente',
						life: 3000,
					});
				} else {
					if (err.status == 0) {
						this.messageService.clear();
						this.messageService.add({
							severity: 'error',
							summary: 'Sin conexión',
							detail: 'No se pudo conectar con el servidor',
							life: 3000,
						});
					}
				}
			}
		);
	}

	ngOnDestroy() {
		this.productoSubscription.unsubscribe();
		this.recetaSubscription.unsubscribe();
	}
}
