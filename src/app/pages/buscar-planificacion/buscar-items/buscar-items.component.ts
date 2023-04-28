import { Component, Input, OnInit } from '@angular/core';
import { VegiService } from 'src/app/services/vegi.service';
import { NgxSpinnerService } from 'ngx-spinner';

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

	@Input() items = new Array<any>();

	nombreItemBuscar: string = '';

	onLoad: boolean = true;

	ngOnInit(): void {
		this.getProductos();
		this.spinner.show();
		setTimeout(() => {
			this.spinner.hide(); /** spinner ends after 5 seconds */
		}, 1000);
	}

	async getProductos() {
		await this.servicio.obtenerProductos().subscribe((data) => {
			this.items = data;
		});
	}

	async buscarProducto() {
		if (this.nombreItemBuscar == '') {
			this.getProductos();
		} else {
			await this.servicio
				.buscarProducto(this.nombreItemBuscar)
				.subscribe((data) => {
					this.items = data;
				});
		}
	}
}
