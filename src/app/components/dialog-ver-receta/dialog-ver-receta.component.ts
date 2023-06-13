import { Component, Input } from '@angular/core';

@Component({
	selector: 'app-dialog-ver-receta',
	templateUrl: './dialog-ver-receta.component.html',
	styleUrls: ['./dialog-ver-receta.component.scss'],
})
export class DialogVerRecetaComponent {
	@Input() id_preparacion!: string;

	@Input() visible!: boolean;
}
