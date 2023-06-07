import { Component, Input } from '@angular/core';
import { Paso } from 'src/app/interfaces/data-types';

@Component({
	selector: 'app-paso-receta',
	templateUrl: './paso-receta.component.html',
	styleUrls: ['./paso-receta.component.scss'],
})
export class PasoRecetaComponent {
	@Input() paso!: Paso;
}
