import { Component, Input } from '@angular/core';
import {
	FormBuilder,
	FormControl,
	FormGroup,
	Validators,
} from '@angular/forms';
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

	imgProductoUrl = environment.imagesUrl;

	formProductoRecomendado!: FormGroup;

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
}
