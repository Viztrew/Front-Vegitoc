import { Component, Input, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';
@Component({
	selector: 'app-item',
	templateUrl: './item.component.html',
	styleUrls: ['./item.component.scss'],
})
export class ItemComponent {
	@Input() item: any;

	imagesUrl = environment.imagesUrl;

	OnInit() {
		//console.log(this.item);
	}
}
