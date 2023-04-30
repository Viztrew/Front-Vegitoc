import { Component, Input, OnInit } from '@angular/core';
import { VegiService } from 'src/app/services/vegi.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { Producto } from 'src/app/interfaces/data-types';

@Component({
	selector: 'app-buscar-items',
	templateUrl: './buscar-items.component.html',
	styleUrls: ['./buscar-items.component.scss'],
})
export class BuscarItemsComponent {
	constructor(
		private servicio: VegiService,
		private spinner: NgxSpinnerService
	) {}

	items = new Array<any>();

	@Input() tipoItem: string = '';

	nombreItemBuscar: string = '';

	sinResultadosTemplate: boolean = false;

	buscarTemplate: boolean = true;

	ngOnInit(): void {}

	async buscarProducto() {
		if (this.nombreItemBuscar == '') {
			this.items = [];
			this.buscarTemplate = true;
			this.sinResultadosTemplate = false;
		} else {
			this.spinner.show();
			this.buscarTemplate = false;
			await this.servicio
				.buscarProducto(this.nombreItemBuscar)
				.subscribe((data) => {
					if (data.length > 0) {
						this.items = data;
						this.sinResultadosTemplate = false;
					} else {
						this.items = [];
						this.sinResultadosTemplate = true;
					}
					this.spinner.hide();
				});
		}
	}

	async obtenerRecetas() {
		this.spinner.show();
		this.buscarTemplate = false;
		await this.servicio.obtenerRecetas().subscribe((data) => {
			if (data.length > 0) {
				this.items = data;
				this.sinResultadosTemplate = false;
			} else {
				this.items = [];
				this.sinResultadosTemplate = true;
			}
			this.spinner.hide();
		});
	}

	async obtenerFavoritos() {
		this.spinner.show();
		this.buscarTemplate = false;
		await this.servicio.obtenerFavoritos().subscribe((data) => {
			let productos = data.productos;
			let recetas = data.recetas;
			this.items = productos.concat(recetas);
			this.spinner.hide();
		});
	}
}
