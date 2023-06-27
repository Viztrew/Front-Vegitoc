import { Component, Input, Output, EventEmitter } from '@angular/core';
import {
	FormBuilder,
	FormControl,
	FormGroup,
	Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { TimeoutError } from 'rxjs';
import {
	InfoProducto,
	InfoReceta,
	Ingrediente,
	PlanProducto,
	PlanReceta,
	UnidadMedida,
} from 'src/app/interfaces/data-types';
import { VegiService } from 'src/app/services/vegi.service';

@Component({
	selector: 'app-dialog-agregar',
	templateUrl: './dialog-agregar.component.html',
	styleUrls: ['./dialog-agregar.component.scss'],
})
export class DialogAgregarComponent {
	constructor(
		private servicio: VegiService,
		private messageService: MessageService,
		private formBuilder: FormBuilder,
		private router: Router
	) {}

	@Input() item: any;

	@Input() visible: boolean = false;

	@Input() titulo!: string;

	@Input() editar!: boolean;

	@Input() crearReceta!: boolean;

	@Output() agregarItemPlanEvent = new EventEmitter<any>();

	@Output() agregarItemRecetaEvent = new EventEmitter<any>();

	mostrarSpinnerBuscar: boolean = true;

	labelButton!: string;

	tituloDialog!: string;

	unidadesMedida = new Array<UnidadMedida>();

	unidadSeleccionada: any = null;

	formAgregar!: FormGroup;

	cantidad: number = 0;

	infoProducto!: InfoProducto;

	infoReceta!: InfoReceta;

	valorMinimo: number = 0;

	calorias: number = 0;

	grasasTotales: number = 0;

	carbohidratos: number = 0;

	proteinas: number = 0;

	itemKcal!: {
		kcal: number;
		grasasTotales: number;
		carbohidratos: number;
		proteinas: number;
		unidad: string;
	};

	async ngOnInit() {
		await this.initForm();

		if (this.item.id_producto) {
			await this.obtenerInformacionProducto();
		} else if (this.item.id_preparacion) {
			await this.obtenerInformacionReceta();
		}

		// se suscriben a los cambios del campo unidad para calcular las calorias
		await this.suscripcionUnidad();

		// se suscriben a los cambios del campo cantidad para calcular las calorias
		await this.suscripcionCantidad();

		if (this.editar) {
			this.labelButton = 'Aceptar';
			this.tituloDialog = 'Editar alimento';
			this.setCantidad();
		} else {
			if (this.crearReceta) {
				this.tituloDialog = 'Agregar';
			} else {
				this.tituloDialog = 'Agregar para ' + this.titulo;
			}

			this.labelButton = 'Agregar';
		}
	}

	async initForm() {
		this.formAgregar = this.formBuilder.group({
			tipo: new FormControl(''),
			nombre: new FormControl(''),
			id: new FormControl(''),
			calorias: new FormControl(''),
			grasasTotales: new FormControl(''),
			carbohidratos: new FormControl(''),
			proteinas: new FormControl(''),
			unidad: new FormControl('', [Validators.required]),
			cantidad: new FormControl('', [
				Validators.required,
				Validators.min(this.valorMinimo),
				Validators.pattern(/^(?:[1-9]\d*|0\.[1-9]\d*|[1-9]\d*\.\d+)$/),
			]),
		});
	}

	async obtenerUnidadesMedida() {
		this.servicio
			.obtenerUnidadesMedidaProducto(this.item.id_producto)
			.subscribe(
				(data) => {
					this.unidadesMedida = data;
					this.mostrarSpinnerBuscar = false;
					this.setUnidadPorDefecto();
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

	async obtenerInformacionProducto() {
		this.servicio
			.obtenerInformacionProducto(this.item.id_producto)
			.subscribe(
				(data) => {
					this.infoProducto = data[0];
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
				},
				async () => {
					await this.obtenerUnidadesMedida();
				}
			);
	}

	async obtenerInformacionReceta() {
		this.servicio
			.obtenerInformacionReceta(this.item.id_preparacion)
			.subscribe(
				(data) => {
					this.infoReceta = data;
					this.unidadesMedida = [
						{
							id_unidad_medida: 1,
							nombre: 'porción',
							unidad_base: 'porcion',
							multiplicador: '1',
						},
					];
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
				},
				() => {
					this.setUnidadPorDefecto();
					this.mostrarSpinnerBuscar = false;
				}
			);
	}

	async agregarItemPlanificacion() {
		if (this.editar && !this.crearReceta) {
			this.agregarItemPlanEvent.emit(this.setValoresItemPlan());
		} else {
			await this.setValoresForm();
			if (this.crearReceta && !this.editar) {
				this.agregarItemRecetaEvent.emit(
					this.setValoresIngredienteReceta(false)
				);
			} else if (this.crearReceta && this.editar) {
				this.agregarItemRecetaEvent.emit(
					this.setValoresIngredienteReceta(true)
				);
			} else if (!this.crearReceta && !this.editar) {
				this.agregarItemPlanEvent.emit(this.formAgregar);
			}
		}
	}
	async setValoresForm() {
		if (this.item.id_producto) {
			this.formAgregar.get('tipo')?.setValue('producto');
			this.formAgregar.get('nombre')?.setValue(this.item.nombre);
			this.formAgregar.get('id')?.setValue(this.item.id_producto);
		} else if (this.item.id_preparacion) {
			this.formAgregar.get('tipo')?.setValue('receta');
			this.formAgregar.get('nombre')?.setValue(this.item.nombre);
			this.formAgregar.get('id')?.setValue(this.item.id_preparacion);
		}
	}

	setValoresIngredienteReceta(editar: boolean): any {
		let ingrediente: Ingrediente;
		if (editar) {
			return (ingrediente = {
				id_producto: this.formAgregar.controls['id'].value,
				nombre_producto: this.item.nombre_producto,
				cantidad: this.formAgregar.controls['cantidad'].value,
				id_unidad_medida:
					this.formAgregar.get('unidad')?.value.id_unidad_medida,
				nombre_unidad: this.formAgregar.get('unidad')?.value.nombre,
				kcal: this.calorias,
				editar: editar,
			});
		} else {
			return (ingrediente = {
				id_producto: this.formAgregar.controls['id'].value,
				nombre_producto: this.formAgregar.controls['nombre'].value,
				cantidad: this.formAgregar.controls['cantidad'].value,
				id_unidad_medida:
					this.formAgregar.get('unidad')?.value.id_unidad_medida,
				nombre_unidad: this.formAgregar.get('unidad')?.value.nombre,
				kcal: this.calorias,
				editar: editar,
			});
		}
	}

	setValoresItemPlan(): any {
		if (this.item.id_producto) {
			let planProducto: PlanProducto;
			return (planProducto = {
				nombre: this.item.nombre,
				id_usuario: this.item.id_usuario,
				fecha: this.item.fecha,
				id_producto: this.item.id_producto,
				kcal: this.calorias.toString(),
				id_plan_producto: this.item.id_plan_producto,
				checked: this.item.checked,
				momento_dia: this.item.momento_dia,
				cantidad: this.formAgregar.get('cantidad')?.value,
				unidad_medida:
					this.formAgregar.get('unidad')?.value.id_unidad_medida,
				nombre_unidad: this.formAgregar.get('unidad')?.value.nombre,
			});
		} else if (this.item.id_preparacion) {
			let planReceta: PlanReceta;
			return (planReceta = {
				nombre: this.item.nombre,
				id_usuario: this.item.id_usuario,
				fecha: this.item.fecha,
				id_preparacion: this.item.id_preparacion,
				kcal: this.calorias.toString(),
				id_plan_preparacion: this.item.id_plan_preparacion,
				checked: this.item.checked,
				momento_dia: this.item.momento_dia,
				cantidad: this.formAgregar.get('cantidad')?.value,
			});
		}
	}

	async setUnidadPorDefecto() {
		if (this.editar) {
			if (this.item.id_producto) {
				if (this.crearReceta) {
					for (let i = 0; i < this.unidadesMedida.length; i++) {
						if (
							this.item.id_unidad_medida ==
							this.unidadesMedida[i].id_unidad_medida
						) {
							this.formAgregar.controls['unidad'].setValue(
								this.unidadesMedida[i]
							);
						}
					}
				} else {
					for (let i = 0; i < this.unidadesMedida.length; i++) {
						if (
							this.item.unidad_medida ==
							this.unidadesMedida[i].id_unidad_medida
						) {
							this.formAgregar.controls['unidad'].setValue(
								this.unidadesMedida[i]
							);
						}
					}
				}
			} else if (this.item.id_preparacion) {
				this.formAgregar.controls['unidad'].setValue(
					this.unidadesMedida[0]
				);
			}
		} else {
			this.formAgregar.controls['unidad'].setValue(
				this.unidadesMedida[0]
			);
		}
	}

	setCantidad() {
		this.formAgregar.controls['cantidad'].setValue(this.item.cantidad);
	}

	async suscripcionCantidad() {
		this.formAgregar.controls['cantidad'].valueChanges.subscribe(
			(cantidad) => {
				if (cantidad >= 0) {
					if (this.itemKcal?.unidad == 'porcion') {
						this.calorias = Math.round(
							this.itemKcal?.kcal * cantidad
						);
						this.grasasTotales = Math.round(
							this.itemKcal?.grasasTotales * cantidad
						);
						this.carbohidratos = Math.round(
							this.itemKcal?.carbohidratos * cantidad
						);
						this.proteinas = Math.round(
							this.itemKcal?.proteinas * cantidad
						);
					} else {
						this.calorias = Math.round(
							(this.itemKcal?.kcal / 100) * cantidad
						);
						this.grasasTotales = Math.round(
							(this.itemKcal?.grasasTotales / 100) * cantidad
						);
						this.carbohidratos = Math.round(
							(this.itemKcal?.carbohidratos / 100) * cantidad
						);
						this.proteinas = Math.round(
							(this.itemKcal?.proteinas / 100) * cantidad
						);
					}
				}
			}
		);
	}

	async suscripcionUnidad() {
		this.formAgregar.controls['unidad'].valueChanges.subscribe((unidad) => {
			if (unidad?.unidad_base == 'porcion') {
				if (this.item.id_preparacion) {
					this.itemKcal = {
						kcal: parseFloat(this.infoReceta.info_receta.kcal_prcn),
						grasasTotales: parseFloat(
							this.infoReceta.info_receta.gr_totales_prcn
						),
						carbohidratos: parseFloat(
							this.infoReceta.info_receta.hidratos_prcn
						),
						proteinas: parseFloat(
							this.infoReceta.info_receta.prot_prcn
						),
						unidad: 'porcion',
					};
				} else if (this.item.id_producto) {
					this.itemKcal = {
						kcal: parseFloat(this.infoProducto?.kcal_prcn),
						grasasTotales: parseFloat(
							this.infoProducto?.gr_totales_prcn
						),
						carbohidratos: parseFloat(
							this.infoProducto?.hidratos_prcn
						),
						proteinas: parseFloat(this.infoProducto?.prot_prcn),
						unidad: 'porcion',
					};
				}
				this.calorias = Math.round(
					this.itemKcal.kcal *
						this.formAgregar.controls['cantidad'].value
				);
				this.grasasTotales = Math.round(
					this.itemKcal.grasasTotales *
						this.formAgregar.controls['cantidad'].value
				);
				this.carbohidratos = Math.round(
					this.itemKcal.carbohidratos *
						this.formAgregar.controls['cantidad'].value
				);
				this.proteinas = Math.round(
					this.itemKcal.proteinas *
						this.formAgregar.controls['cantidad'].value
				);
			} else {
				this.itemKcal = {
					kcal: parseFloat(this.infoProducto?.kcal_100),
					grasasTotales: parseFloat(
						this.infoProducto?.gr_totales_100
					),
					carbohidratos: parseFloat(this.infoProducto?.hidratos_100),
					proteinas: parseFloat(this.infoProducto?.prot_100),
					unidad: unidad?.unidad_base,
				};
				this.calorias = Math.round(
					(this.itemKcal.kcal / 100) *
						this.formAgregar.controls['cantidad'].value
				);
				this.grasasTotales = Math.round(
					(this.itemKcal.grasasTotales / 100) *
						this.formAgregar.controls['cantidad'].value
				);
				this.carbohidratos = Math.round(
					(this.itemKcal.carbohidratos / 100) *
						this.formAgregar.controls['cantidad'].value
				);
				this.proteinas = Math.round(
					(this.itemKcal.proteinas / 100) *
						this.formAgregar.controls['cantidad'].value
				);
			}
		});
	}
}
