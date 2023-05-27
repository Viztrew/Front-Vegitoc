import {
	Component,
	Input,
	Output,
	EventEmitter,
	ElementRef,
} from '@angular/core';
import {
	FormBuilder,
	FormControl,
	FormGroup,
	Validators,
} from '@angular/forms';
import { MessageService } from 'primeng/api';
import { Observable } from 'rxjs';
import {
	InfoProducto,
	PlanProducto,
	PlanReceta,
	Producto,
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
		private formBuilder: FormBuilder
	) {}

	@Input() item: any;

	@Input() visible: boolean = false;

	@Input() titulo!: string;

	@Input() editar!: boolean;

	@Output() agregarItemEvent = new EventEmitter<any>();

	labelButton!: string;

	tituloDialog!: string;

	unidadesMedida = new Array<UnidadMedida>();

	unidadSeleccionada: any = null;

	formAgregar!: FormGroup;

	cantidad: number = 0;

	infoProducto!: InfoProducto;

	valorMinimo: number = 0;

	calorias: number = 0;

	itemKcal!: {
		kcal: number;
		unidad: string;
	};

	async ngOnInit() {
		await this.initForm();

		if (this.item.id_producto) {
			await this.obtenerInformacionProducto();
			await this.obtenerUnidadesMedida();
		} else if (this.item.id_preparacion) {
			this.unidadesMedida = [
				{
					id_unidad_medida: 1,
					nombre: 'porción',
					unidad_base: 'porcion',
					multiplicador: '1',
				},
			];
		}

		// se suscriben a los cambios del campo unidad para calcular las calorias
		await this.suscripcionUnidad();

		// se setea la porcion como unidad por defecto
		await this.setUnidadPorDefecto();

		// se suscriben a los cambios del campo cantidad para calcular las calorias
		await this.suscripcionCantidad();

		if (this.editar) {
			this.labelButton = 'Aceptar';
			this.tituloDialog = 'Editar alimento';
			this.setCantidad();
		} else {
			this.tituloDialog = 'Agregar para ' + this.titulo;
			this.labelButton = 'Agregar';
		}
	}

	async initForm() {
		this.formAgregar = this.formBuilder.group({
			tipo: new FormControl(''),
			nombre: new FormControl(''),
			id: new FormControl(''),
			calorias: new FormControl(''),
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
			.subscribe((data) => {
				this.unidadesMedida = data;
				this.setUnidadPorDefecto();
			});
	}

	async obtenerInformacionProducto() {
		this.servicio
			.obtenerInformacionProducto(this.item.id_producto)
			.subscribe((data) => {
				this.infoProducto = data[0];
			});
	}

	async agregarItemPlanificacion() {
		if (this.editar) {
			this.agregarItemEvent.emit(this.setValores());
		} else {
			await this.setValoresForm();
			this.agregarItemEvent.emit(this.formAgregar);
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

	setValores(): any {
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
		if (this.editar && this.item.id_producto) {
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
							this.itemKcal.kcal * cantidad
						);
					} else if (this.itemKcal?.unidad == 'g') {
						this.calorias = Math.round(
							(this.itemKcal.kcal / 100) * cantidad
						);
					}
				}
			}
		);
	}

	async suscripcionUnidad() {
		this.formAgregar.controls['unidad'].valueChanges.subscribe((unidad) => {
			if (unidad?.unidad_base == 'porcion') {
				if (this.editar) {
					if (this.item.id_preparacion) {
						this.itemKcal = {
							kcal: this.item.kcal / this.item.cantidad,
							unidad: 'porcion',
						};
					} else if (this.item.id_producto) {
						this.itemKcal = {
							kcal: parseFloat(this.infoProducto.kcal_prcn),
							unidad: 'porcion',
						};
					}
				} else {
					this.itemKcal = {
						kcal: this.item.kcal_prcn,
						unidad: 'porcion',
					};
				}
				this.calorias = Math.round(
					this.itemKcal.kcal *
						this.formAgregar.controls['cantidad'].value
				);
			} else if (unidad?.unidad_base == 'g') {
				this.itemKcal = {
					kcal: parseFloat(this.infoProducto.kcal_100),
					unidad: 'g',
				};
				this.calorias = Math.round(
					(this.itemKcal.kcal / 100) *
						this.formAgregar.controls['cantidad'].value
				);
			}
		});
	}
}
