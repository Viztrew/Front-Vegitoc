import { Component, Input } from '@angular/core';

@Component({
	selector: 'app-dialog-ver-producto',
	templateUrl: './dialog-ver-producto.component.html',
	styleUrls: ['./dialog-ver-producto.component.scss'],
})
export class DialogVerProductoComponent {
	@Input() id_producto!: string;

	@Input() visible!: boolean;
}
