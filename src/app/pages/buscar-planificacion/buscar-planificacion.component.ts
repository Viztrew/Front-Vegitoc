import { Component, OnInit } from '@angular/core';

@Component({
	selector: 'app-buscar-planificacion',
	templateUrl: './buscar-planificacion.component.html',
	styleUrls: ['./buscar-planificacion.component.scss'],
})
export class BuscarPlanificacionComponent implements OnInit {
	constructor() {}

	TipoItems: Array<string> = ['producto', 'receta', 'favorito', 'misrecetas'];

	tabScroll: boolean = true;

	ngOnInit() {
		window.screen.width;
		if (screen.width < 486) {
			this.tabScroll = true;
		} else {
			this.tabScroll = false;
		}
	}
}
