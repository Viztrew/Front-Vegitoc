import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { MessageService } from 'primeng/api';
import { TimeoutError } from 'rxjs';
import { Receta } from 'src/app/interfaces/data-types';
import { VegiService } from 'src/app/services/vegi.service';
import { environment } from 'src/environments/environment';

@Component({
	selector: 'app-mis-recetas',
	templateUrl: './mis-recetas.component.html',
	styleUrls: ['./mis-recetas.component.scss'],
})
export class MisRecetasComponent {
	constructor(
		private servicio: VegiService,
		private spinner: NgxSpinnerService,
		private messageService: MessageService,
		private router: Router
	) {}

	Recetas!: Array<Receta>;

	misRecetasTemplate: boolean = true;

	dialogEliminarReceta: boolean = false;

	recetaEliminar!: Receta;

	imgRecetaUrl = environment.baseUrl;

	async ngOnInit() {
		await this.servicio.loggedIn();
		if (!this.servicio.isLoggedIn) {
			this.messageService.clear();
			this.messageService.add({
				severity: 'error',
				summary: 'Sesión caducada',
				detail: 'Inicia sesión nuevamente',
				life: 3000,
			});
			this.router.navigate(['/login']);
		}

		this.obtenerRecetasUsuario();
	}

	async obtenerRecetasUsuario() {
		this.spinner.show();
		this.servicio.obtenerRecetasUsuario().subscribe(
			(data) => {
				if (data.length > 0) {
					this.misRecetasTemplate = false;
					this.Recetas = data;
				} else {
					this.misRecetasTemplate = true;
					this.Recetas = [];
				}
				this.spinner.hide();
			},
			(err) => {
				this.spinner.hide();
				if (err.status == 401) {
					this.router.navigateByUrl('login');
					this.messageService.clear();
					this.messageService.add({
						severity: 'error',
						summary: 'Sesión caducada',
						detail: 'Inicia sesión nuevamente',
						life: 3000,
					});
				} else if (err.status == 0) {
					this.messageService.clear();
					this.messageService.add({
						severity: 'error',
						summary: 'Sin conexión',
						detail: 'No se pudo conectar con el servidor',
						sticky: true,
					});
				} else if (err instanceof TimeoutError) {
					this.messageService.clear();
					this.messageService.add({
						severity: 'error',
						summary: 'Timeout',
						detail: 'Se excedió el tiempo de espera máximo de respuesta',
						sticky: true,
					});
				} else {
					this.messageService.clear();
					this.messageService.add({
						severity: 'error',
						summary: 'Error desconocido',
						detail: 'Se produjo un error desconocido, intente nuevamente.',
						sticky: true,
					});
				}
			}
		);
	}

	showDialogEliminarReceta(receta: Receta) {
		this.recetaEliminar = receta;
		this.dialogEliminarReceta = true;
	}

	hideDialogEliminarReceta() {
		this.recetaEliminar = {} as Receta;
		this.dialogEliminarReceta = false;
	}

	eliminarReceta(receta: Receta) {
		this.spinner.show();

		this.servicio.eliminarReceta(receta.id_preparacion).subscribe(
			(data) => {
				this.hideDialogEliminarReceta();
				this.eliminarPasoArray(receta);
				this.messageService.clear();
				this.messageService.add({
					severity: 'success',
					summary: '¡Receta Eliminada!',
					detail:
						'La receta ' +
						receta.nombre +
						' ha sido eliminada exitosamente',
					life: 3000,
				});
				this.spinner.hide();
			},
			(err) => {
				this.spinner.hide();
				if (err.status == 401) {
					this.router.navigateByUrl('login');
					this.messageService.clear();
					this.messageService.add({
						severity: 'error',
						summary: 'Sesión caducada',
						detail: 'Inicia sesión nuevamente',
						life: 3000,
					});
				} else if (err.status == 0) {
					this.messageService.clear();
					this.messageService.add({
						severity: 'error',
						summary: 'Sin conexión',
						detail: 'No se pudo conectar con el servidor',
						sticky: true,
					});
				} else if (err instanceof TimeoutError) {
					this.messageService.clear();
					this.messageService.add({
						severity: 'error',
						summary: 'Timeout',
						detail: 'Se excedió el tiempo de espera máximo de respuesta',
						sticky: true,
					});
				} else {
					this.messageService.clear();
					this.messageService.add({
						severity: 'error',
						summary: 'Error desconocido',
						detail: 'Se produjo un error desconocido, intente nuevamente.',
						sticky: true,
					});
				}
			}
		);
	}

	eliminarPasoArray(receta: Receta) {
		let elemento = document.getElementById(
			receta.id_preparacion.toString()
		);
		if (elemento) {
			elemento.classList.add('zoom');
		}
		setTimeout(() => {
			for (let i = 0; i < this.Recetas.length; i++) {
				if (receta.id_preparacion == this.Recetas[i].id_preparacion) {
					this.Recetas.splice(i, 1);
					break;
				}
			}
		}, 100);
	}
}
