import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import {
	ProductoRecomendado,
	RecetaRecomendada,
} from 'src/app/interfaces/data-types';
import { VegiService } from 'src/app/services/vegi.service';
import { environment } from 'src/environments/environment';
import { Message, MessageService } from 'primeng/api';

@Component({
	selector: 'app-dialog-recomendacion',
	templateUrl: './dialog-recomendacion.component.html',
	styleUrls: ['./dialog-recomendacion.component.scss'],
})
export class DialogRecomendacionComponent {
	constructor(
		private servicio: VegiService,
		private router: Router,
		private messageService: MessageService,
		private infoMessageService: MessageService
	) {}

	@Input() momento_dia!: string;

	@Input() dia!: string;

	@Input() fecha!: string;

	@Input() visible!: boolean;

	@Output() cancelarRecomendacionEvent = new EventEmitter<any>();

	private suscripcionRecomendacion!: Subscription;

	imgProductoUrl = environment.imagesUrl;

	imgRecetaUrl = environment.baseUrl;

	titulo!: string;

	mostrarSpinnerBuscar: boolean = true;

	productosRecomendados!: Array<ProductoRecomendado>;

	recetasRecomendadas!: Array<RecetaRecomendada>;

	ngOnInit() {
		this.titulo = 'Recomendación para ' + this.dia;

		this.mostrarSpinnerBuscar = true;

		this.obtenerRecomendacion();
	}

	obtenerRecomendacion() {
		console.log('recomendacion');
		this.suscripcionRecomendacion = this.servicio
			.obtenerRecomendacion(this.fecha)
			.subscribe(
				(data) => {
					this.mostrarSpinnerBuscar = false;
					if (data.is_valid) {
						if (data.productos) {
							this.productosRecomendados = data.productos;
						} else {
							this.productosRecomendados = [];
						}

						if (data.recetas) {
							this.recetasRecomendadas = data.recetas;
						} else {
							this.recetasRecomendadas = [];
						}
					}
					console.log(data);
				},
				(err) => {
					if (err.status == 401) {
						this.router.navigateByUrl('login');
						this.messageService.clear();
						this.messageService.add({
							severity: 'error',
							summary: 'Sesión caducada',
							detail: 'Inicia sesión nuevamente',
							life: 3000,
						});
					} else {
						if (err.status == 0) {
							this.messageService.clear();
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

	cancelarRecomendacion() {
		this.suscripcionRecomendacion.unsubscribe();
		this.visible = false;
	}

	ngOnDestroy() {
		this.cancelarRecomendacion();
	}
}
