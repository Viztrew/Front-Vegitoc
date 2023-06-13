import { Component, Input, ViewChild } from '@angular/core';
import {
	FormBuilder,
	FormControl,
	FormGroup,
	Validators,
} from '@angular/forms';
import { DialogVerProductoComponent } from 'src/app/components/dialog-ver-producto/dialog-ver-producto.component';
import { ProductoRecomendado } from 'src/app/interfaces/data-types';
import { environment } from 'src/environments/environment';

@Component({
	selector: 'app-producto-recomendacion',
	templateUrl: './producto-recomendacion.component.html',
	styleUrls: ['./producto-recomendacion.component.scss'],
})
export class ProductoRecomendacionComponent {
	constructor(private formBuilder: FormBuilder) {}

	@Input() producto!: ProductoRecomendado;

	@ViewChild(DialogVerProductoComponent) dialogVerProductoChild: any;

	imgProductoUrl = environment.imagesUrl;

	formProductoRecomendado!: FormGroup;

	dialogVerProducto: boolean = false;

	idProductoVer!: string;

	momentos_dia = [
		{ nombre: 'DESAYUNO' },
		{ nombre: 'ALMUERZO' },
		{ nombre: 'CENA' },
	];

	ngOnInit() {
		this.initProductoRecomendado();
	}

	initProductoRecomendado() {
		this.formProductoRecomendado = this.formBuilder.group({
			momento_dia: new FormControl(''),
		});
	}

	mostrarDialogVerProducto() {
		if (this.dialogVerProductoChild) {
			this.dialogVerProductoChild.visible = true;
		} else {
			this.dialogVerProducto = true;
		}
	}

	verProducto() {
		this.idProductoVer = this.producto.id_producto;
		this.mostrarDialogVerProducto();
	}
}
