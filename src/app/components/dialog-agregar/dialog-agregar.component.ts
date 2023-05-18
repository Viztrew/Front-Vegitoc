import { Component, Input, Output, EventEmitter } from '@angular/core';
import {
	FormBuilder,
	FormControl,
	FormGroup,
	Validators,
} from '@angular/forms';
import { MessageService } from 'primeng/api';
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

	@Output() agregarItemEvent = new EventEmitter<any>();

	unidadesMedida = new Array<UnidadMedida>();

	unidadSeleccionada: any = null;

	formAgregar!: FormGroup;

	cantidad: number = 0;

	infoItem!: InfoProducto;

	ngOnInit() {
		this.formAgregar = this.initForm();
		this.obtenerUnidadesMedida();
	}

	initForm(): FormGroup {
		return this.formBuilder.group({
			nombre: new FormControl(''),
			id: new FormControl(''),
			unidad: new FormControl('', [Validators.required]),
			cantidad: new FormControl('', [Validators.required]),
		});
	}

	async agregarItemPlanificacion(form: FormGroup) {
		await this.setValoresForm();
		this.agregarItemEvent.emit(form);
	}

	async setValoresForm() {
		this.formAgregar.get('nombre')?.setValue(this.item.nombre);
		this.formAgregar.get('id')?.setValue(this.item.id_producto);
	}
	obtenerUnidadesMedida() {
		this.servicio
			.obtenerUnidadesMedidaProducto(this.item.id_producto)
			.subscribe((data) => {
				this.unidadesMedida = data;
			});
	}

	obtenerInformacionProducto() {
		this.servicio
			.obtenerInformacionProducto(this.item.id_producto)
			.subscribe((data) => {
				this.infoItem = data;
				console.log(data);
			});
	}

	toNumber(string: string): number {
		return parseFloat(string);
	}
}
