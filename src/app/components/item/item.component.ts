import {
	Component,
	Input,
	OnInit,
	Output,
	EventEmitter,
	ViewChild,
} from '@angular/core';
import { Router } from '@angular/router';
import { VegiService } from 'src/app/services/vegi.service';
import { environment } from 'src/environments/environment';
import { MessageService } from 'primeng/api';
import { NgxSpinnerService } from 'ngx-spinner';
import { Producto, Receta, UnidadMedida } from 'src/app/interfaces/data-types';
import { DialogAgregarComponent } from '../dialog-agregar/dialog-agregar.component';
@Component({
	selector: 'app-item',
	templateUrl: './item.component.html',
	styleUrls: ['./item.component.scss'],
})
export class ItemComponent {
	constructor(
		public router: Router,
		private servicio: VegiService,
		private messageService: MessageService,
		private spinner: NgxSpinnerService
	) {}

	@Input() item: any;

	@Input() tipoItem: string = '';

	@Output() agregarItemPlanificacionEvent = new EventEmitter<any>();

	@ViewChild(DialogAgregarComponent) dialogChild: any;

	imageSrc: string = '';

	itemRoute: string = '';

	mostrarDialog: boolean = false;

	ngOnInit(): void {
		if (this.item.id_preparacion) {
			this.itemRoute = '/buscar/receta/' + this.item.id_preparacion;
			this.imageSrc = '../../../assets/img/nophoto.png';
		} else {
			this.imageSrc =
				environment.imagesUrl + '/' + this.item.id_producto + '.jpg';
			this.itemRoute = '/buscar/producto/' + this.item.id_producto;
		}
	}

	updateUrl(event: Event) {
		this.imageSrc = '../../../assets/img/nophoto.png';
	}

	mostrarDialogAgregar() {
		if (this.dialogChild) {
			this.dialogChild.visible = true;
		} else {
			this.mostrarDialog = true;
		}
	}

	agregarItemPlan(item: any) {
		this.agregarItemPlanificacionEvent.emit(item);
		this.mostrarDialog = false;
	}

	toggleFavorito() {
		if (this.item.favorito) {
			if (this.item.id_producto) {
				this.quitarFavoritoProducto();
			} else {
				this.quitarFavoritoReceta();
			}
		} else {
			if (this.item.id_producto) {
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
				(data) => {
					//this.agregarFavoritoEvent.emit(this.item);
				},
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
