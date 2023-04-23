import { Component, OnInit } from '@angular/core';
import { VegiService } from 'src/app/services/vegi.service';
import { Producto } from 'src/app/interfaces/data-types';
@Component({
	selector: 'app-buscar-planificacion',
	templateUrl: './buscar-planificacion.component.html',
	styleUrls: ['./buscar-planificacion.component.scss'],
})
export class BuscarPlanificacionComponent implements OnInit {
	constructor(private servicio: VegiService) {}

	token: any;
	nombreProductoBuscar: string = '';
	productos = new Array<Producto>();

	ngOnInit(): void {
		this.token = localStorage.getItem('sesion');
	}
	buscarProducto() {
		this.servicio
			.buscarProducto(this.nombreProductoBuscar, this.token)
			.subscribe(
				(data) => {
					console.log(data[0].nombre_prod);
					this.productos = data;
					console.log(this.productos[0].nombre_prod);
				},
				(error) => {
					console.log(error.status);
				}
			);
	}
}
