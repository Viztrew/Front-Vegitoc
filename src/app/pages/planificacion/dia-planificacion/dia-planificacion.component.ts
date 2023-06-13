import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { MessageService } from 'primeng/api';
import { Subscription, TimeoutError } from 'rxjs';
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
import { environment } from 'src/environments/environment';
import { DialogRecomendacionComponent } from '../dialog-recomendacion/dialog-recomendacion.component';

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

	@ViewChild(DialogAgregarComponent) dialogChildEditar: any;

	@ViewChild(DialogRecomendacionComponent) dialogChildRecomendar: any;

	dialogEditarItemPlan: boolean = false;

	dialogConfirmarRecomendacion: boolean = false;

	dialogRecomendacion: boolean = false;

	itemEditar!: PlanProducto | PlanReceta;

	Planificacion!: Planificacion;

	momentosDia = ['DESAYUNO', 'ALMUERZO', 'CENA'];

	checked: boolean = false;

	checkedTrue: boolean = true;

	productoSubscription!: Subscription;

	recetaSubscription!: Subscription;

	caloriasDiarias: number = 0;

	imagesProductoUrl = environment.imagesUrl;

	imagesRecetaUrl = environment.baseUrl;

	async ngOnInit() {
		await this.obtenerPlanificacion();
		this.obtenerInformacionUsuario();
		this.productoSubscription =
			this.servicioComponentes.productos$.subscribe((data) => {
				if (data.dia?.toLowerCase() == this.dia.toLowerCase()) {
					let producto = data;
					producto.fecha = this.obtenerFecha(producto.dia);
					producto.checked = false;
					this.agregarProductoPlanificacion(producto, false);
				}
			});

		this.recetaSubscription = this.servicioComponentes.recetas$.subscribe(
			(data) => {
				if (data.dia?.toLowerCase() == this.dia.toLowerCase()) {
					let receta = data;
					receta.fecha = this.obtenerFecha(receta.dia);
					receta.checked = false;
					this.agregarRecetaPlanificacion(receta, false);
				}
			}
		);
	}

	async showDialogEditar() {
		if (this.dialogChildEditar) {
			this.dialogEditarItemPlan = false;
			setTimeout(() => {
				this.dialogEditarItemPlan = true;
			}, 100);
		} else {
			this.dialogEditarItemPlan = true;
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
					this.calcularTotalCaloriasDiarias();
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
					} else if (err.status == 0) {
						this.messageService.clear();
						this.messageService.add({
							severity: 'error',
							summary: 'Sin conexión',
							detail: 'No se pudo conectar con el servidor',
							sticky: true,
						});
					} else if (err instanceof TimeoutError) {
						this.messageService.clear();
						this.messageService.add({
							severity: 'error',
							summary: 'Timeout',
							detail: 'Se excedió el tiempo de espera máximo de respuesta',
							sticky: true,
						});
					} else {
						this.messageService.clear();
						this.messageService.add({
							severity: 'error',
							summary: 'Error desconocido',
							detail: 'Se produjo un error desconocido, intente nuevamente.',
							sticky: true,
						});
					}
				}
			);
	}

	obtenerInformacionUsuario() {
		this.servicio.obtenerInformacionUsuario().subscribe((data) => {});
	}

	calcularTotalCaloriasDiarias() {
		this.caloriasDiarias = 0;
		if (this.Planificacion.productos.length > 0) {
			for (let i = 0; i < this.Planificacion.productos.length; i++) {
				this.caloriasDiarias =
					this.caloriasDiarias +
					parseFloat(this.Planificacion.productos[i].kcal);
			}
		}

		if (this.Planificacion.preparaciones.length > 0) {
			for (let i = 0; i < this.Planificacion.preparaciones.length; i++) {
				this.caloriasDiarias =
					this.caloriasDiarias +
					parseFloat(this.Planificacion.preparaciones[i].kcal);
			}
		}
	}

	obtenerFecha(dia: string) {
		let fecha = '';
		let fechaHoy = new Date();
		let year: string;
		let month: string;
		let day: string;
		if (dia.toLowerCase() == 'hoy') {
			year = fechaHoy.getFullYear().toString();
			month = (fechaHoy.getMonth() + 1).toString().padStart(2, '0');
			day = fechaHoy.getDate().toString().padStart(2, '0');
			fecha = year + '-' + month + '-' + day;
		}
		if (dia.toLowerCase() == 'ayer') {
			let fechaAyer = new Date(fechaHoy);
			fechaAyer.setDate(fechaHoy.getDate() - 1);
			year = fechaAyer.getFullYear().toString();
			month = (fechaAyer.getMonth() + 1).toString().padStart(2, '0');
			day = fechaAyer.getDate().toString().padStart(2, '0');
			fecha = year + '-' + month + '-' + day;
		}
		if (dia.toLowerCase() == 'mañana') {
			let fechaManana = new Date(fechaHoy);
			fechaManana.setDate(fechaHoy.getDate() + 1);
			year = fechaManana.getFullYear().toString();
			month = (fechaManana.getMonth() + 1).toString().padStart(2, '0');
			day = fechaManana.getDate().toString().padStart(2, '0');
			fecha = year + '-' + month + '-' + day;
		}
		return fecha;
	}

	async agregarProductoPlanificacion(
		producto: ProductoAgregarPlan,
		recomendacion: boolean
	) {
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
					if (!recomendacion) {
						this.messageService.add({
							severity: 'success',
							summary:
								'¡' +
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
				} else if (err.status == 0) {
					this.messageService.clear();
					this.messageService.add({
						severity: 'error',
						summary: 'Sin conexión',
						detail: 'No se pudo conectar con el servidor',
						sticky: true,
					});
				} else if (err instanceof TimeoutError) {
					this.messageService.clear();
					this.messageService.add({
						severity: 'error',
						summary: 'Timeout',
						detail: 'Se excedió el tiempo de espera máximo de respuesta',
						sticky: true,
					});
				} else {
					this.messageService.clear();
					this.messageService.add({
						severity: 'error',
						summary: 'Error desconocido',
						detail: 'Se produjo un error desconocido, intente nuevamente.',
						sticky: true,
					});
				}
			}
		);
	}

	async agregarRecetaPlanificacion(
		receta: RecetaAgregarPlan,
		recomendacion: boolean
	) {
		this.servicioComponentes.addReceta({} as RecetaAgregarPlan);
		this.servicio.agregarRecetaPlanificacion(receta).subscribe(
			(data) => {
				if (data) {
					this.obtenerPlanificacion();
					let articulo: string;
					if (receta.momento_dia.toLowerCase() == 'cena') {
						articulo = 'la';
					} else {
						articulo = 'el';
					}
					if (!recomendacion) {
						this.messageService.add({
							severity: 'success',
							summary:
								'¡' +
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
				} else if (err.status == 0) {
					this.messageService.clear();
					this.messageService.add({
						severity: 'error',
						summary: 'Sin conexión',
						detail: 'No se pudo conectar con el servidor',
						sticky: true,
					});
				} else if (err instanceof TimeoutError) {
					this.messageService.clear();
					this.messageService.add({
						severity: 'error',
						summary: 'Timeout',
						detail: 'Se excedió el tiempo de espera máximo de respuesta',
						sticky: true,
					});
				} else {
					this.messageService.clear();
					this.messageService.add({
						severity: 'error',
						summary: 'Error desconocido',
						detail: 'Se produjo un error desconocido, intente nuevamente.',
						sticky: true,
					});
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
				} else if (err.status == 0) {
					this.messageService.clear();
					this.messageService.add({
						severity: 'error',
						summary: 'Sin conexión',
						detail: 'No se pudo conectar con el servidor',
						sticky: true,
					});
				} else if (err instanceof TimeoutError) {
					this.messageService.clear();
					this.messageService.add({
						severity: 'error',
						summary: 'Timeout',
						detail: 'Se excedió el tiempo de espera máximo de respuesta',
						sticky: true,
					});
				} else {
					this.messageService.clear();
					this.messageService.add({
						severity: 'error',
						summary: 'Error desconocido',
						detail: 'Se produjo un error desconocido, intente nuevamente.',
						sticky: true,
					});
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
				} else if (err.status == 0) {
					this.messageService.clear();
					this.messageService.add({
						severity: 'error',
						summary: 'Sin conexión',
						detail: 'No se pudo conectar con el servidor',
						sticky: true,
					});
				} else if (err instanceof TimeoutError) {
					this.messageService.clear();
					this.messageService.add({
						severity: 'error',
						summary: 'Timeout',
						detail: 'Se excedió el tiempo de espera máximo de respuesta',
						sticky: true,
					});
				} else {
					this.messageService.clear();
					this.messageService.add({
						severity: 'error',
						summary: 'Error desconocido',
						detail: 'Se produjo un error desconocido, intente nuevamente.',
						sticky: true,
					});
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
				} else if (err.status == 0) {
					this.messageService.clear();
					this.messageService.add({
						severity: 'error',
						summary: 'Sin conexión',
						detail: 'No se pudo conectar con el servidor',
						sticky: true,
					});
				} else if (err instanceof TimeoutError) {
					this.messageService.clear();
					this.messageService.add({
						severity: 'error',
						summary: 'Timeout',
						detail: 'Se excedió el tiempo de espera máximo de respuesta',
						sticky: true,
					});
				} else {
					this.messageService.clear();
					this.messageService.add({
						severity: 'error',
						summary: 'Error desconocido',
						detail: 'Se produjo un error desconocido, intente nuevamente.',
						sticky: true,
					});
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
				} else if (err.status == 0) {
					this.messageService.clear();
					this.messageService.add({
						severity: 'error',
						summary: 'Sin conexión',
						detail: 'No se pudo conectar con el servidor',
						sticky: true,
					});
				} else if (err instanceof TimeoutError) {
					this.messageService.clear();
					this.messageService.add({
						severity: 'error',
						summary: 'Timeout',
						detail: 'Se excedió el tiempo de espera máximo de respuesta',
						sticky: true,
					});
				} else {
					this.messageService.clear();
					this.messageService.add({
						severity: 'error',
						summary: 'Error desconocido',
						detail: 'Se produjo un error desconocido, intente nuevamente.',
						sticky: true,
					});
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
							planProducto.momento_dia +
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
				} else if (err.status == 0) {
					this.messageService.clear();
					this.messageService.add({
						severity: 'error',
						summary: 'Sin conexión',
						detail: 'No se pudo conectar con el servidor',
						sticky: true,
					});
				} else if (err instanceof TimeoutError) {
					this.messageService.clear();
					this.messageService.add({
						severity: 'error',
						summary: 'Timeout',
						detail: 'Se excedió el tiempo de espera máximo de respuesta',
						sticky: true,
					});
				} else {
					this.messageService.clear();
					this.messageService.add({
						severity: 'error',
						summary: 'Error desconocido',
						detail: 'Se produjo un error desconocido, intente nuevamente.',
						sticky: true,
					});
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
							planReceta.momento_dia +
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
				} else if (err.status == 0) {
					this.messageService.clear();
					this.messageService.add({
						severity: 'error',
						summary: 'Sin conexión',
						detail: 'No se pudo conectar con el servidor',
						sticky: true,
					});
				} else if (err instanceof TimeoutError) {
					this.messageService.clear();
					this.messageService.add({
						severity: 'error',
						summary: 'Timeout',
						detail: 'Se excedió el tiempo de espera máximo de respuesta',
						sticky: true,
					});
				} else {
					this.messageService.clear();
					this.messageService.add({
						severity: 'error',
						summary: 'Error desconocido',
						detail: 'Se produjo un error desconocido, intente nuevamente.',
						sticky: true,
					});
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
		this.showDialogEditar();
	}

	editarProductoPlan(producto: PlanProducto) {
		this.itemEditar = producto;
		this.showDialogEditar();
	}

	async editarItemPlan(item: any) {
		this.dialogChildEditar.visible = false;
		if (item.id_plan_preparacion) {
			this.editarPlanPreparacion(item);
		} else if (item.id_plan_producto) {
			this.editarPlanProducto(item);
		}
	}

	async verProducto(producto: PlanProducto) {
		this.router.navigateByUrl('info/producto/' + producto.id_producto);
	}

	async verReceta(receta: PlanReceta) {
		this.router.navigateByUrl('info/receta/' + receta.id_preparacion);
	}

	showDialogConfirmarRecomendacion() {
		this.dialogConfirmarRecomendacion = true;
	}

	hideDialogConfirmarRecomendacion() {
		this.dialogConfirmarRecomendacion = false;
	}

	async showDialogRecomendacion() {
		this.hideDialogConfirmarRecomendacion();
		if (this.dialogChildRecomendar) {
			this.dialogRecomendacion = false;
			setTimeout(() => {
				this.dialogRecomendacion = true;
			}, 100);
		} else {
			this.dialogRecomendacion = true;
		}
	}

	async eliminarProductosNoChecked() {
		if (this.Planificacion.productos != undefined) {
			if (this.Planificacion.productos.length > 0) {
				for (let i = 0; i < this.Planificacion.productos.length; i++) {
					if (!this.Planificacion.productos[i].checked) {
						this.eliminarPlanProducto(
							this.Planificacion.productos[i]
						);
					}
				}
			}
		}
	}

	async eliminarRecetasNoChecked() {
		if (this.Planificacion.preparaciones != undefined) {
			if (this.Planificacion.preparaciones.length > 0) {
				for (
					let i = 0;
					i < this.Planificacion.preparaciones.length;
					i++
				) {
					if (!this.Planificacion.preparaciones[i].checked) {
						this.eliminarPlanReceta(
							this.Planificacion.preparaciones[i]
						);
					}
				}
			}
		}
	}

	async agregarProductosRecomendadosPlan(
		productosRecomendados: Array<ProductoAgregarPlan>
	) {
		if (productosRecomendados != undefined) {
			if (productosRecomendados.length != 0) {
				await this.eliminarProductosNoChecked();

				for (let i = 0; i < productosRecomendados.length; i++) {
					this.agregarProductoPlanificacion(
						productosRecomendados[i],
						true
					);
				}
				this.messageService.add({
					severity: 'success',
					summary: 'Productos agregados',
					detail:
						'Se han agregado los productos recomendados para ' +
						this.dia.toUpperCase(),
					life: 2500,
				});
			}
		}
	}

	async agregarRecetassRecomendadasPlan(
		recetasRecomendadas: Array<RecetaAgregarPlan>
	) {
		if (recetasRecomendadas != undefined) {
			if (recetasRecomendadas.length != 0) {
				await this.eliminarRecetasNoChecked();
				for (let i = 0; i < recetasRecomendadas.length; i++) {
					this.agregarRecetaPlanificacion(
						recetasRecomendadas[i],
						true
					);
				}
				this.messageService.add({
					severity: 'success',
					summary: 'Recetas agregados',
					detail:
						'Se han agregado las recetas recomendadas para ' +
						this.dia.toUpperCase(),
					life: 2500,
				});
			}
		}
	}

	ngOnDestroy() {
		this.productoSubscription.unsubscribe();
		this.recetaSubscription.unsubscribe();
	}
	/*target - total - total-checked*/
}
