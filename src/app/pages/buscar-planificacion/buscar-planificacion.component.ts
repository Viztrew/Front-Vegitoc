import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { VegiService } from 'src/app/services/vegi.service';

@Component({
	selector: 'app-buscar-planificacion',
	templateUrl: './buscar-planificacion.component.html',
	styleUrls: ['./buscar-planificacion.component.scss'],
})
export class BuscarPlanificacionComponent implements OnInit {
	constructor(
		private servicio: VegiService,
		private messageService: MessageService,
		private router: Router
	) {}

	TipoItems: Array<string> = ['producto', 'receta', 'favorito', 'misrecetas'];

	tabScroll: boolean = true;

	async ngOnInit() {
		await this.servicio.loggedIn();
		if (!this.servicio.isLoggedIn) {
			this.messageService.clear();
			this.messageService.add({
				severity: 'error',
				summary: 'Sesión caducada',
				detail: 'Inicia sesión nuevamente',
				life: 3000,
			});
			this.router.navigate(['/login']);
		}
		window.screen.width;
		if (screen.width < 486) {
			this.tabScroll = true;
		} else {
			this.tabScroll = false;
		}
	}
}
