import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { Producto } from 'src/app/interfaces/data-types';
import { VegiService } from 'src/app/services/vegi.service';

@Component({
	selector: 'app-planificacion',
	templateUrl: './planificacion.component.html',
	styleUrls: ['./planificacion.component.scss'],
})
export class PlanificacionComponent {
	constructor(
		private servicio: VegiService,
		private messageService: MessageService,
		private router: Router
	) {}

	dias = ['Ayer', 'Hoy', 'Mañana'];

	mover: any;

	anchoDiaPlan: number = 0;

	async ngOnInit() {
		await this.servicio.loggedIn();
		if (!this.servicio.isLoggedIn) {
			this.router.navigate(['/login']);
		}
		this.mover = document.getElementById('plan-scroll');
		this.scrollRightDPlan();
	}

	scrollRightDPlan() {
		this.anchoDiaPlan =
			document.getElementById('day-scroll')?.clientWidth || 0;
		this.mover?.scroll(this.mover.scrollLeft + this.anchoDiaPlan, 0);
	}

	scrollLeftPlan() {
		this.anchoDiaPlan =
			document.getElementById('day-scroll')?.clientWidth || 0;
		this.mover?.scroll(this.mover.scrollLeft - this.anchoDiaPlan, 0);
	}
}
