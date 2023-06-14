import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { VegiService } from 'src/app/services/vegi.service';
import { InfoProducto } from 'src/app/interfaces/data-types';
import { NgxSpinnerService } from 'ngx-spinner';
import { environment } from 'src/environments/environment';
import { MessageService } from 'primeng/api';
import { TimeoutError } from 'rxjs';
@Component({
	selector: 'app-info-producto',
	templateUrl: './info-producto.component.html',
	styleUrls: ['./info-producto.component.scss'],
})
export class InfoProductoComponent {
	constructor(
		private route: ActivatedRoute,
		private servicio: VegiService,
		private spinner: NgxSpinnerService,
		private messageService: MessageService,
		private router: Router
	) {}

	@Input() id_producto!: string;

	@Input() dialog!: boolean;

	infoProducto = {} as InfoProducto;

	imageSrc: string = '';

	ngOnInit(): void {
		if (this.id_producto) {
			this.imageSrc =
				environment.imagesUrl + '/' + this.id_producto + '.jpg';
		} else {
			this.imageSrc =
				environment.imagesUrl +
				'/' +
				this.route.snapshot.params['id'] +
				'.jpg';

			this.id_producto = this.route.snapshot.params['id'];
		}
		this.obtenerInformacionProducto();
	}

	updateUrl(event: Event) {
		this.imageSrc = '../../../assets/img/nophoto.png';
	}

	async obtenerInformacionProducto() {
		this.spinner.show();
		this.servicio.obtenerInformacionProducto(this.id_producto).subscribe(
			(data) => {
				this.infoProducto = data[0];
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
}
