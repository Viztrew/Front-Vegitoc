import { Component, Input, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { environment } from 'src/environments/environment';
@Component({
	selector: 'app-item',
	templateUrl: './item.component.html',
	styleUrls: ['./item.component.scss'],
})
export class ItemComponent {
	constructor(public router: Router) {}

	@Input() item: any;

	@Input() tipoItem: string = '';

	imageSrc: string = '';

	itemRoute: string = '';

	ngOnInit(): void {
		this.imageSrc =
			environment.imagesUrl + '/' + this.item.id_producto + '.jpg';
		if (this.tipoItem == 'receta') {
			this.itemRoute = '/buscar/receta/' + this.item.id_preparacion;
		} else {
			this.itemRoute = '/buscar/producto/' + this.item.id_producto;
		}
	}
	updateUrl(event: Event) {
		this.imageSrc = '../../../assets/img/nophoto.png';
	}

	anhadirProductoPlanificacion() {
		console.log('añadir');
	}
}
