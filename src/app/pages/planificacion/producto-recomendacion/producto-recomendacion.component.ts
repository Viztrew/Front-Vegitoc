import {
	Component,
	EventEmitter,
	Input,
	Output,
	ViewChild,
} from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';
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

	@Output() estadoProductoEvent = new EventEmitter<any>();

	@ViewChild(DialogVerProductoComponent) dialogVerProductoChild: any;

	imgProductoUrl = environment.imagesUrl;

	formProductoRecomendado!: FormGroup;

	dialogVerProducto: boolean = false;

	idProductoVer!: string;

	momentos_dia = [
		{ nombre: 'Descartar' },
		{ nombre: 'DESAYUNO' },
		{ nombre: 'ALMUERZO' },
		{ nombre: 'CENA' },
	];

	private subscriptionMomento!: Subscription;

	async ngOnInit() {
		await this.initProductoRecomendado();

		await this.suscriptionMomentoDia();
	}

	async suscriptionMomentoDia() {
		this.subscriptionMomento = this.formProductoRecomendado.controls[
			'momento_dia'
		].valueChanges.subscribe((momento_dia) => {
			if (momento_dia) {
				this.estadoProductoEvent.emit({
					momento_dia: momento_dia,
					producto: this.producto,
				});
			}
		});
	}

	async initProductoRecomendado() {
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

	ngOnDestroy() {
		this.subscriptionMomento.unsubscribe();
	}
}
