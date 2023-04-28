import { Component, OnInit } from '@angular/core';
import { VegiService } from 'src/app/services/vegi.service';
import { Producto } from 'src/app/interfaces/data-types';
import { environment } from 'src/environments/environment';
@Component({
	selector: 'app-buscar-planificacion',
	templateUrl: './buscar-planificacion.component.html',
	styleUrls: ['./buscar-planificacion.component.scss'],
})
export class BuscarPlanificacionComponent implements OnInit {
	constructor(private servicio: VegiService) {}

	ngOnInit() {}
}
