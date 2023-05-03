import { Component, Input, OnInit } from '@angular/core';
import { VegiService } from 'src/app/services/vegi.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { Producto, Receta } from 'src/app/interfaces/data-types';
import { MessageService } from 'primeng/api';
@Component({
	selector: 'app-buscar-items',
	templateUrl: './buscar-items.component.html',
	styleUrls: ['./buscar-items.component.scss'],
})
export class BuscarItemsComponent {
	constructor(
		private servicio: VegiService,
		private spinner: NgxSpinnerService,
		private messageService: MessageService
	) {}

	items = new Array<any>();

	@Input() tipoItem: string = '';

	nombreItemBuscar: string = '';

	sinResultadosTemplate: boolean = false;

	buscarTemplate: boolean = true;

	favoritoTemplate: boolean = true;

	misRecetasTemplate: boolean = true;

	ngOnInit(): void {
		if (this.tipoItem == 'favorito') {
			this.obtenerFavoritos();
		}
		if (this.tipoItem == 'misrecetas') {
			this.obtenerRecetasUsuario();
		}
	}
	async buscarReceta() {
		if (this.nombreItemBuscar == '') {
			this.items = [];
			this.buscarTemplate = true;
			this.sinResultadosTemplate = false;
		} else {
			this.spinner.show();
			await this.servicio.buscarReceta(this.nombreItemBuscar).subscribe(
				(data) => {
					this.buscarTemplate = false;
					if (data.length > 0) {
						this.items = data;
						this.sinResultadosTemplate = false;
					} else {
						this.items = [];
						this.sinResultadosTemplate = true;
					}
					this.spinner.hide();
				},
				(err) => {
					this.spinner.hide();
					if (err.status == 401) {
						this.messageService.add({
							severity: 'error',
							summary: 'Sesión caducada',
							detail: 'Inicia sesión nuevamente',
							life: 3000,
						});
					} else {
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
	}

	async buscarProducto() {
		if (this.nombreItemBuscar == '') {
			this.items = [];
			this.buscarTemplate = true;
			this.sinResultadosTemplate = false;
		} else {
			this.spinner.show();

			await this.servicio.buscarProducto(this.nombreItemBuscar).subscribe(
				(data) => {
					this.buscarTemplate = false;
					if (data.length > 0) {
						this.items = data;
						this.sinResultadosTemplate = false;
					} else {
						this.items = [];
						this.sinResultadosTemplate = true;
					}
					this.spinner.hide();
				},
				(err) => {
					this.spinner.hide();
					if (err.status == 401) {
						this.messageService.add({
							severity: 'error',
							summary: 'Sesión caducada',
							detail: 'Inicia sesión nuevamente',
							life: 3000,
						});
					} else {
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
	}

	async obtenerFavoritos() {
		this.spinner.show();
		await this.servicio.obtenerFavoritos().subscribe(
			(data) => {
				if (data.productos.length > 0 || data.recetas.length > 0) {
					this.favoritoTemplate = false;
					let productos = data.productos;
					let recetas = data.recetas;
					this.items = productos.concat(recetas);
				} else {
					this.favoritoTemplate = true;
					this.items = [];
				}
				this.spinner.hide();
			},
			(err) => {
				this.spinner.hide();
				if (err.status == 401) {
					this.messageService.add({
						severity: 'error',
						summary: 'Sesión caducada',
						detail: 'Inicia sesión nuevamente',
						life: 3000,
					});
				} else {
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

	async obtenerRecetasUsuario() {
		this.spinner.show();
		await this.servicio.obtenerRecetasUsuario().subscribe(
			(data) => {
				if (data.length > 0) {
					this.misRecetasTemplate = false;
					this.items = data;
				} else {
					this.misRecetasTemplate = true;
					this.items = [];
				}
				this.spinner.hide();
			},
			(err) => {
				this.spinner.hide();
				if (err.status == 401) {
					this.messageService.add({
						severity: 'error',
						summary: 'Sesión caducada',
						detail: 'Inicia sesión nuevamente',
						life: 3000,
					});
				} else {
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
}
