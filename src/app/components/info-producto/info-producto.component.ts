import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { VegiService } from 'src/app/services/vegi.service';
import { InfoProducto } from 'src/app/interfaces/data-types';
import { NgxSpinnerService } from 'ngx-spinner';
import { environment } from 'src/environments/environment';
import { MessageService } from 'primeng/api';
@Component({
	selector: 'app-info-producto',
	templateUrl: './info-producto.component.html',
	styleUrls: ['./info-producto.component.scss'],
})
export class InfoProductoComponent implements OnInit {
	constructor(
		private route: ActivatedRoute,
		private servicio: VegiService,
		private spinner: NgxSpinnerService,
		private messageService: MessageService
	) {}

	infoProducto = {} as InfoProducto;

	imageSrc: string = '';

	ngOnInit(): void {
		this.imageSrc =
			environment.imagesUrl +
			'/' +
			this.route.snapshot.params['id'] +
			'.jpg';
		this.obtenerInformacionProducto();
	}

	updateUrl(event: Event) {
		this.imageSrc = '../../../assets/img/nophoto.png';
	}

	async obtenerInformacionProducto() {
		this.spinner.show();
		this.servicio
			.obtenerInformacionProducto(this.route.snapshot.params['id'])
			.subscribe(
				(data) => {
					this.infoProducto = data[0];
					this.spinner.hide();
				},
				(err) => {
					this.spinner.hide();
					if (err.status == 401) {
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
}
