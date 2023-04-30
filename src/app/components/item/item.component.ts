import { Component, Input, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';
@Component({
	selector: 'app-item',
	templateUrl: './item.component.html',
	styleUrls: ['./item.component.scss'],
})
export class ItemComponent {
	@Input() item: any;

	imageSrc: string = '';

	ngOnInit(): void {
		this.imageSrc =
			environment.imagesUrl + '/' + this.item.id_producto + '.jpg';
	}
	updateUrl(event: Event) {
		this.imageSrc = '../../../assets/img/nophoto.png';
	}

	anhadirProductoPlanificacion() {
		console.log('añadir');
	}
}
