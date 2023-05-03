import { Component, Input, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { VegiService } from 'src/app/services/vegi.service';
import { environment } from 'src/environments/environment';
import { MessageService } from 'primeng/api';
@Component({
	selector: 'app-item',
	templateUrl: './item.component.html',
	styleUrls: ['./item.component.scss'],
})
export class ItemComponent {
	constructor(
		public router: Router,
		private servicio: VegiService,
		private messageService: MessageService
	) {}

	@Input() item: any;

	@Input() tipoItem: string = '';

	imageSrc: string = '';

	itemRoute: string = '';

	ngOnInit(): void {
		this.imageSrc =
			environment.imagesUrl + '/' + this.item.id_producto + '.jpg';
		if (this.tipoItem == 'receta') {
			this.itemRoute = '/buscar/receta/' + this.item.id_preparacion;
		} else {
			this.itemRoute = '/buscar/producto/' + this.item.id_producto;
		}
	}
	updateUrl(event: Event) {
		this.imageSrc = '../../../assets/img/nophoto.png';
	}

	anhadirProductoPlanificacion() {
		console.log('añadir');
	}

	toggleFavorito() {
		if (this.item.favorito) {
			if (this.tipoItem == 'producto') {
				this.quitarFavoritoProducto();
			} else {
				this.quitarFavoritoReceta();
			}
		} else {
			if (this.tipoItem == 'producto') {
				this.agregarFavoritoProducto();
			} else {
				this.agregarFavoritoReceta();
			}
		}
	}

	async agregarFavoritoProducto() {
		this.item.favorito = true;
		await this.servicio
			.agregarFavoritoProducto(this.item.id_producto)
			.subscribe(
				(data) => {},
				(err) => {
					this.item.favorito = false;
					this.messageService.add({
						severity: 'error',
						summary: 'Agregar a Favoritos',
						detail:
							'El producto "' +
							this.item.nombre +
							'" no se logró agregar a favoritos, intente nuevamente.',
						life: 3000,
					});
				}
			);
	}

	async quitarFavoritoProducto() {
		this.item.favorito = false;
		await this.servicio
			.quitarFavoritoProducto(this.item.id_producto)
			.subscribe(
				(data) => {
					if (data) {
					}
				},
				(err) => {
					this.item.favorito = true;
					this.messageService.add({
						severity: 'error',
						summary: 'Quitar de Favoritos',
						detail:
							'El producto "' +
							this.item.nombre +
							'" no se logró quitar de favoritos, intente nuevamente.',
						life: 3000,
					});
				}
			);
	}

	async agregarFavoritoReceta() {
		this.item.favorito = true;
		await this.servicio
			.agregarFavoritoReceta(this.item.id_preparacion)
			.subscribe(
				(data) => {
					if (data) {
					}
				},
				(err) => {
					this.item.favorito = false;
					this.messageService.add({
						severity: 'error',
						summary: 'Agregar a Favoritos',
						detail:
							'La receta "' +
							this.item.nombre +
							'" no se logró agregar a favoritos, intente nuevamente.',
						life: 3000,
					});
				}
			);
	}

	async quitarFavoritoReceta() {
		this.item.favorito = false;
		await this.servicio
			.quitarFavoritoReceta(this.item.id_preparacion)
			.subscribe(
				(data) => {
					if (data) {
					}
				},
				(err) => {
					this.item.favorito = true;
					this.messageService.add({
						severity: 'error',
						summary: 'Quitar de Favoritos',
						detail:
							'La receta "' +
							this.item.nombre +
							'" no se logró quitar de favoritos, intente nuevamente.',
						life: 3000,
					});
				}
			);
	}
}
