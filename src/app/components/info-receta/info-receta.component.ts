import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { VegiService } from 'src/app/services/vegi.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { environment } from 'src/environments/environment';
import { InfoReceta } from 'src/app/interfaces/data-types';
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
		private router: Router
	) {}

	infoReceta = {} as InfoReceta;

	imageSrc: string = '';

	imagesUrl: string = '';

	ngOnInit(): void {
		this.imagesUrl = environment.imagesUrl;
		this.imageSrc =
			environment.imagesUrl +
			'/' +
			this.route.snapshot.params['id'] +
			'.jpg';
		this.obtenerInformacionReceta();
	}

	updateUrl(event: Event) {
		this.imageSrc = '../../../assets/img/nophoto.png';
	}

	async obtenerInformacionReceta() {
		this.spinner.show();
		this.servicio
			.obtenerInformacionReceta(this.route.snapshot.params['id'])
			.subscribe(
				(data) => {
					this.spinner.hide();
					this.infoReceta = data;
				},
				(err) => {
					this.spinner.hide();
					console.log(err);
				}
			);
	}

	async verProducto(id_producto: string) {
		this.router.navigateByUrl('buscar/producto/' + id_producto);
	}
}
