import { Component, Input, Output, EventEmitter } from '@angular/core';
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

	@Output() agregarItemEvent = new EventEmitter<any>();

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
			await this.obtenerUnidadesMedida();
			await this.obtenerInformacionProducto();
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

		// se suscriben a los cambios del campo cantidad para calcular las calorias
		this.suscripcionCantidad();

		// se suscriben a los cambios del campo unidad para calcular las calorias
		this.suscripcionUnidad();

		// se setea la porcion como unidad por defecto
		this.setUnidadPorDefecto();
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

	async agregarItemPlanificacion(form: FormGroup) {
		await this.setValoresForm();
		this.agregarItemEvent.emit(form);
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

	setUnidadPorDefecto() {
		this.formAgregar.controls['unidad'].setValue(this.unidadesMedida[0]);
	}

	suscripcionCantidad() {
		this.formAgregar.controls['cantidad'].valueChanges.subscribe(
			(cantidad) => {
				if (cantidad >= 0) {
					if (this.itemKcal.unidad == 'porcion') {
						this.calorias = Math.round(
							this.itemKcal.kcal * cantidad
						);
					} else if (this.itemKcal.unidad == 'g') {
						this.calorias = Math.round(
							(this.itemKcal.kcal / 100) * cantidad
						);
					}
				}
			}
		);
	}

	suscripcionUnidad() {
		this.formAgregar.controls['unidad'].valueChanges.subscribe((unidad) => {
			if (unidad?.unidad_base == 'porcion') {
				this.itemKcal = {
					kcal: this.item.kcal_prcn,
					unidad: 'porcion',
				};
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
