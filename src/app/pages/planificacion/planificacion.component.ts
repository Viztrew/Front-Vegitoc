import { Component } from '@angular/core';
import { VegiService } from 'src/app/services/vegi.service';
import { Producto } from 'src/app/interfaces/data-types';

@Component({
	selector: 'app-planificacion',
	templateUrl: './planificacion.component.html',
	styleUrls: ['./planificacion.component.scss'],
})
export class PlanificacionComponent {
	constructor() {}

	dias = ['Ayer', 'Hoy', 'Mañana'];

	productos = new Array<Producto>();

	mover: any;

	anchoDiaPlan: number = 0;

	ngOnInit(): void {
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
