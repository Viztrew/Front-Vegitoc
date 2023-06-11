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
import { DialogAgregarComponent } from '../dialog-agregar/dialog-agregar.component';
import { FormGroup } from '@angular/forms';
import { Ingrediente } from 'src/app/interfaces/data-types';

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
		private route: ActivatedRoute
	) {}

	@Input() item!: any;

	@Input() tipoItem: string = '';

	@Input() crearReceta!: boolean;

	@Output() agregarProductoPlanificacionEvent = new EventEmitter<any>();

	@Output() agregarRecetaPlanificacionEvent = new EventEmitter<any>();

	@Output() productoFavoritoEvent = new EventEmitter<any>();

	@Output() recetaFavoritoEvent = new EventEmitter<any>();

	@Output() agregarIngredienteRecetaEvent = new EventEmitter<any>();

	@ViewChild(DialogAgregarComponent) dialogChild: any;

	imageSrc: string = '';

	itemRoute: string = '';

	mostrarDialog: boolean = false;

	// variable para saber a que dia  de la planificacion se agregara el item
	dia!: string;

	ngOnInit(): void {
		if (!this.crearReceta) {
			this.dia = this.route.snapshot.params['dia'];
		}
		if (this.item.id_preparacion) {
			this.imageSrc =
				environment.baseUrl + '/' + this.item.id_preparacion + '.jpg';
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

	mostrarDialogAgregarPlan() {
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

	async agregarItemReceta(item: Ingrediente) {
		this.agregarIngredienteRecetaEvent.emit(item);
		this.mostrarDialog = false;
	}

	toggleFavorito() {
		if (this.item.id_preparacion) {
			this.recetaFavoritoEvent.emit(this.item);
		} else {
			this.productoFavoritoEvent.emit(this.item);
		}
	}

	verItem() {
		this.router.navigateByUrl(this.itemRoute);
	}
}
