import {
	Component,
	Input,
	OnInit,
	Output,
	EventEmitter,
	ViewChild,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { VegiService } from 'src/app/services/vegi.service';
import { environment } from 'src/environments/environment';
import { MessageService } from 'primeng/api';
import { NgxSpinnerService } from 'ngx-spinner';
import { DialogAgregarComponent } from '../dialog-agregar/dialog-agregar.component';
import { FormGroup } from '@angular/forms';

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
		private spinner: NgxSpinnerService,
		private route: ActivatedRoute
	) {}

	@Input() item: any;

	@Input() tipoItem: string = '';

	@Output() agregarProductoPlanificacionEvent = new EventEmitter<any>();

	@Output() agregarRecetaPlanificacionEvent = new EventEmitter<any>();

	@ViewChild(DialogAgregarComponent) dialogChild: any;

	imageSrc: string = '';

	itemRoute: string = '';

	mostrarDialog: boolean = false;

	// variable para saber a que dia  de la planificacion se agregara el item
	dia!: string;

	ngOnInit(): void {
		this.dia = this.route.snapshot.params['dia'];

		if (this.item.id_preparacion) {
			this.imageSrc = '../../../assets/img/nophoto.png';
			this.itemRoute = '/info/receta/' + this.item.id_preparacion;
		} else {
			this.imageSrc =
				environment.imagesUrl + '/' + this.item.id_producto + '.jpg';
			this.itemRoute = '/info/producto/' + this.item.id_producto;
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

	// se recibe el formulario del dialogAgregar y segun el tipo (producto/receta) se emite el evento
	agregarItemPlan(item: FormGroup) {
		if (item.get('tipo')?.value == 'producto') {
			this.agregarProductoPlanificacionEvent.emit(item);
		} else if (item.get('tipo')?.value == 'receta') {
			this.agregarRecetaPlanificacionEvent.emit(item);
		}
		this.mostrarDialog = false;
	}

	async toggleFavorito() {
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
		this.servicio.agregarFavoritoProducto(this.item.id_producto).subscribe(
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
		this.servicio.quitarFavoritoProducto(this.item.id_producto).subscribe(
			(data) => {},
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
		this.servicio.agregarFavoritoReceta(this.item.id_preparacion).subscribe(
			(data) => {},
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
		this.servicio.quitarFavoritoReceta(this.item.id_preparacion).subscribe(
			(data) => {},
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
