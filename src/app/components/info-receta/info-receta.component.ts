import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { VegiService } from 'src/app/services/vegi.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { environment } from 'src/environments/environment';
@Component({
	selector: 'app-info-receta',
	templateUrl: './info-receta.component.html',
	styleUrls: ['./info-receta.component.scss'],
})
export class InfoRecetaComponent implements OnInit {
	constructor(
		private route: ActivatedRoute,
		private servicio: VegiService,
		private spinner: NgxSpinnerService
	) {}

	imageSrc: string = '';

	ngOnInit(): void {
		this.imageSrc =
			environment.imagesUrl +
			'/' +
			this.route.snapshot.params['id'] +
			'.jpg';
	}

	updateUrl(event: Event) {
		this.imageSrc = '../../../assets/img/nophoto.png';
	}
}
