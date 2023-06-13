import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { VegiService } from 'src/app/services/vegi.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { environment } from 'src/environments/environment';
import { InfoReceta } from 'src/app/interfaces/data-types';
import { MessageService } from 'primeng/api';
import { TimeoutError } from 'rxjs';
@Component({
	selector: 'app-info-receta',
	templateUrl: './info-receta.component.html',
	styleUrls: ['./info-receta.component.scss'],
})
export class InfoRecetaComponent implements OnInit {
	constructor(
		private route: ActivatedRoute,
		private servicio: VegiService,
		private spinner: NgxSpinnerService,
		private router: Router,
		private messageService: MessageService
	) {}
	@Input() id_preparacion!: string;

	@Input() dialog!: boolean;

	infoReceta!: InfoReceta;

	imageSrc: string = '';

	imagesUrl: string = '';

	imagesRecetaUrl!: string;

	noImageUrl = '../../../assets/img/nophoto.png';

	async ngOnInit() {
		this.imagesUrl = environment.imagesUrl;
		if (this.dialog) {
			this.imagesRecetaUrl =
				environment.baseUrl + '/' + this.id_preparacion + '.jpg';
		} else {
			this.id_preparacion = this.route.snapshot.params['id'];
			this.imagesRecetaUrl =
				environment.baseUrl +
				'/' +
				this.route.snapshot.params['id'] +
				'.jpg';
		}
		await this.obtenerInformacionReceta();
	}

	updateUrl(event: Event) {
		this.imageSrc = this.noImageUrl;
	}

	async obtenerInformacionReceta() {
		this.spinner.show();
		this.servicio.obtenerInformacionReceta(this.id_preparacion).subscribe(
			(data) => {
				this.spinner.hide();
				if (data.info_receta) {
					this.infoReceta = data;
				} else {
					this.router.navigateByUrl('/404');
				}
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

	async verProducto(id_producto: string) {
		this.router.navigateByUrl('info/producto/' + id_producto);
	}
}
