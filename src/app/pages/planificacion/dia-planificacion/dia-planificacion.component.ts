import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { MessageService } from 'primeng/api';
import { Observable, Subscription } from 'rxjs';
import { DialogAgregarComponent } from 'src/app/components/dialog-agregar/dialog-agregar.component';
import {
	ProductoAgregarPlan,
	Planificacion,
	RecetaAgregarPlan,
	CheckedProducto,
	CheckedReceta,
	PlanProducto,
	PlanReceta,
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

	@ViewChild(DialogAgregarComponent) dialogChild: any;

	mostrarDialog: boolean = false;

	itemEditar!: PlanProducto | PlanReceta;

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

	async mostrarDialogEditar() {
		if (this.dialogChild) {
			this.mostrarDialog = false;
			setTimeout(() => {
				this.mostrarDialog = true;
			}, 100);
		} else {
			this.mostrarDialog = true;
		}
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
						this.router.navigateByUrl('login');
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
				if (err.status == 401) {
					this.router.navigateByUrl('login');
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
					this.router.navigateByUrl('login');
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
					this.router.navigateByUrl('login');
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
					this.router.navigateByUrl('login');
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

	eliminarPlanProducto(producto: any) {
		this.servicio.eliminarPlanProducto(producto.id_plan_producto).subscribe(
			(data) => {
				if (data) {
					this.eliminarProductoArrayPlan(producto);
					this.messageService.clear();
					this.messageService.add({
						severity: 'success',
						summary:
							producto.nombre +
							' ha sido eliminado de ' +
							producto.momento_dia +
							' de ' +
							this.dia.toUpperCase(),
						life: 2500,
					});
				}
			},
			(err) => {
				if (err.status == 401) {
					this.router.navigateByUrl('login');
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

	eliminarPlanReceta(receta: any) {
		this.servicio.eliminarPlanReceta(receta.id_plan_preparacion).subscribe(
			(data) => {
				if (data) {
					this.eliminarRecetaArrayPlan(receta);
					this.messageService.clear();
					this.messageService.add({
						severity: 'success',
						summary:
							receta.nombre +
							' ha sido eliminado de ' +
							receta.momento_dia +
							' de ' +
							this.dia.toUpperCase(),
						life: 2500,
					});
				}
			},
			(err) => {
				if (err.status == 401) {
					this.router.navigateByUrl('login');
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

	editarPlanProducto(planProducto: PlanProducto) {
		this.servicio.editarPlanProducto(planProducto).subscribe(
			(data) => {
				if (data) {
					this.editarProductoArrayPlan(planProducto);
					this.messageService.clear();
					this.messageService.add({
						severity: 'success',
						summary:
							planProducto.nombre +
							' ha sido editado de ' +
							this.dia.toUpperCase(),
						life: 2500,
					});
				}
			},
			(err) => {
				if (err.status == 401) {
					this.router.navigateByUrl('login');
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

	editarPlanPreparacion(planReceta: PlanReceta) {
		this.servicio.editarPlanPreparacion(planReceta).subscribe(
			(data) => {
				if (data) {
					this.editarRecetaArrayPlan(planReceta);
					this.messageService.clear();
					this.messageService.add({
						severity: 'success',
						summary:
							planReceta.nombre +
							' ha sido editado de ' +
							this.dia.toUpperCase(),
						life: 2500,
					});
				}
			},
			(err) => {
				if (err.status == 401) {
					this.router.navigateByUrl('login');
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

	eliminarProductoArrayPlan(producto: any) {
		let elemento = document.getElementById(
			producto.id_producto + '-' + producto.id_plan_producto
		);
		if (elemento) {
			elemento.classList.add('zoom');
		}
		setTimeout(() => {
			for (let i = 0; i < this.Planificacion.productos.length; i++) {
				if (
					producto.id_plan_producto ==
					this.Planificacion.productos[i].id_plan_producto
				) {
					this.Planificacion.productos.splice(i, 1);
					break;
				}
			}
		}, 100);
	}

	eliminarRecetaArrayPlan(receta: any) {
		let elemento = document.getElementById(
			receta.id_preparacion + '-' + receta.id_plan_preparacion
		);
		if (elemento) {
			elemento.classList.add('zoom');
		}
		setTimeout(() => {
			for (let i = 0; i < this.Planificacion.preparaciones.length; i++) {
				if (
					receta.id_plan_preparacion ==
					this.Planificacion.preparaciones[i].id_plan_preparacion
				) {
					this.Planificacion.preparaciones.splice(i, 1);
					break;
				}
			}
		}, 100);
	}

	editarProductoArrayPlan(planProducto: PlanProducto) {
		for (let i = 0; i < this.Planificacion.productos.length; i++) {
			if (
				planProducto.id_plan_producto ==
				this.Planificacion.productos[i].id_plan_producto
			) {
				this.Planificacion.productos.splice(i, 1, planProducto);
				break;
			}
		}
	}

	editarRecetaArrayPlan(planReceta: PlanReceta) {
		for (let i = 0; i < this.Planificacion.preparaciones.length; i++) {
			if (
				planReceta.id_plan_preparacion ==
				this.Planificacion.preparaciones[i].id_plan_preparacion
			) {
				this.Planificacion.preparaciones.splice(i, 1, planReceta);
				break;
			}
		}
	}

	editarRecetaPlan(receta: PlanReceta) {
		this.itemEditar = receta;
		this.mostrarDialogEditar();
	}

	editarProductoPlan(producto: PlanProducto) {
		this.itemEditar = producto;
		this.mostrarDialogEditar();
	}

	async editarItemPlan(item: any) {
		this.dialogChild.visible = false;
		if (item.id_plan_preparacion) {
			this.editarPlanPreparacion(item);
		} else if (item.id_plan_producto) {
			this.editarPlanProducto(item);
		}
	}

	ngOnDestroy() {
		this.productoSubscription.unsubscribe();
		this.recetaSubscription.unsubscribe();
	}
}
