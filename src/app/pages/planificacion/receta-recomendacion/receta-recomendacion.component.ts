import {
	Component,
	EventEmitter,
	Input,
	Output,
	ViewChild,
} from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { DialogVerRecetaComponent } from 'src/app/components/dialog-ver-receta/dialog-ver-receta.component';
import { RecetaRecomendada } from 'src/app/interfaces/data-types';
import { environment } from 'src/environments/environment';
import { Subscription } from 'rxjs';
@Component({
	selector: 'app-receta-recomendacion',
	templateUrl: './receta-recomendacion.component.html',
	styleUrls: ['./receta-recomendacion.component.scss'],
})
export class RecetaRecomendacionComponent {
	constructor(private formBuilder: FormBuilder) {}

	@Input() receta!: RecetaRecomendada;

	@Output() estadoRecetaEvent = new EventEmitter<any>();

	@ViewChild(DialogVerRecetaComponent) dialogVerRecetaChild: any;

	imgRecetaUrl = environment.baseUrl;

	formRecetaRecomendado!: FormGroup;

	dialogVerReceta: boolean = false;

	idRecetaVer!: string;

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
		this.subscriptionMomento = this.formRecetaRecomendado.controls[
			'momento_dia'
		].valueChanges.subscribe((momento_dia) => {
			if (momento_dia) {
				this.estadoRecetaEvent.emit({
					momento_dia: momento_dia,
					receta: this.receta,
				});
			}
		});
	}

	async initProductoRecomendado() {
		this.formRecetaRecomendado = this.formBuilder.group({
			momento_dia: new FormControl(''),
		});
	}

	mostrarDialogVerProducto() {
		if (this.dialogVerRecetaChild) {
			this.dialogVerRecetaChild.visible = true;
		} else {
			this.dialogVerReceta = true;
		}
	}

	verReceta() {
		this.idRecetaVer = this.receta.id_preparacion.toString();
		this.mostrarDialogVerProducto();
	}

	ngOnDestroy() {
		this.subscriptionMomento.unsubscribe();
	}
}
