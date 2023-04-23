import { Component } from '@angular/core';
import { VegiService } from 'src/app/services/vegi.service';
@Component({
	selector: 'app-planificacion',
	templateUrl: './planificacion.component.html',
	styleUrls: ['./planificacion.component.scss'],
})
export class PlanificacionComponent {
	constructor(private servicio: VegiService) {}
}
