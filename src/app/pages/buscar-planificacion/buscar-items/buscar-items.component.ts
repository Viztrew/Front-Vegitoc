import { Component, Input } from '@angular/core';
import { VegiService } from 'src/app/services/vegi.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { MessageService } from 'primeng/api';
import { ComponentsService } from 'src/app/services/components.service';
import { ActivatedRoute, Router } from '@angular/router';
import {
	Favoritos,
	Producto,
	ProductoAgregarPlan,
	Receta,
	RecetaAgregarPlan,
} from 'src/app/interfaces/data-types';
import { FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';
@Component({
	selector: 'app-buscar-items',
	templateUrl: './buscar-items.component.html',
	styleUrls: ['./buscar-items.component.scss'],
})
export class BuscarItemsComponent {
	constructor(
		private servicio: VegiService,
		private spinner: NgxSpinnerService,
		private messageService: MessageService,
		private servicioComponentes: ComponentsService,
		private router: Router,
		private route: ActivatedRoute
	) {}

	@Input() tipoItem: string = '';

	items = new Array<any>();

	favoritos = {
		productos: [{} as Producto],
		recetas: [{} as Receta],
	} as Favoritos;

	dialogAgregarVisible: boolean = false;

	itemAgregar: any;

	nombreItemBuscar: string = '';

	copiaNombreItemBuscar: string = '';

	sinResultadosTemplate: boolean = false;

	buscarTemplate: boolean = true;

	misRecetasTemplate: boolean = true;

	favoritoRecetaTemplate: boolean = true;

	favoritoProductoTemplate: boolean = true;

	iconActualizar: string = 'pi pi-refresh';

	productosFavoritosSubscription!: Subscription;

	recetasFavoritosSubscription!: Subscription;

	ngOnInit(): void {
		if (this.tipoItem == 'favorito') {
			this.obtenerFavoritos();
			this.productosFavoritosSubscription =
				this.servicioComponentes.productosFavoritos$.subscribe(
					(producto) => {
						if (producto.favorito == false) {
							this.toggleProductoArrayFavoritos(producto);
							this.agregarFavoritoProducto(producto);
						} else if (producto.favorito) {
							this.toggleProductoArrayFavoritos(producto);
							this.quitarFavoritoProducto(producto);
						}
					}
				);

			this.recetasFavoritosSubscription =
				this.servicioComponentes.recetasFavoritos$.subscribe(
					(receta) => {
						if (receta.favorito == false) {
							this.toggleRecetaArrayFavoritos(receta);
							this.agregarFavoritoReceta(receta);
						} else if (receta.favorito) {
							this.toggleRecetaArrayFavoritos(receta);
							this.quitarFavoritoReceta(receta);
						}
					}
				);
		}
		if (this.tipoItem == 'misrecetas') {
			this.obtenerRecetasUsuario();
		}
	}
	async buscarReceta() {
		if (this.nombreItemBuscar == '') {
			this.items = [];
			this.buscarTemplate = true;
			this.sinResultadosTemplate = false;
		} else {
			this.spinner.show();
			this.servicio.buscarReceta(this.nombreItemBuscar).subscribe(
				(data) => {
					let container = document.getElementById('item-container');
					if (container) {
						container.scrollTop = 0;
					}
					this.buscarTemplate = false;
					if (data.length > 0) {
						this.items = data;
						this.sinResultadosTemplate = false;
					} else {
						this.items = [];
						this.copiaNombreItemBuscar = this.nombreItemBuscar;
						this.sinResultadosTemplate = true;
					}
					this.spinner.hide();
				},
				(err) => {
					this.spinner.hide();
					if (err.status == 401) {
						this.router.navigateByUrl('login');
						this.messageService.clear();
						this.messageService.add({
							severity: 'error',
							summary: 'Sesión caducada',
							detail: 'Inicia sesión nuevamente',
							life: 3000,
						});
					} else {
						if (err.status == 0) {
							this.messageService.clear();
							this.messageService.add({
								severity: 'error',
								summary: 'Sin conexión',
								detail: 'No se pudo conectar con el servidor',
								life: 3000,
							});
						}
					}
				}
			);
		}
	}

	async buscarProducto() {
		if (this.nombreItemBuscar == '') {
			this.items = [];
			this.buscarTemplate = true;
			this.sinResultadosTemplate = false;
		} else {
			this.spinner.show();
			this.servicio.buscarProducto(this.nombreItemBuscar).subscribe(
				(data) => {
					let container = document.getElementById('item-container');
					if (container) {
						container.scrollTop = 0;
					}
					this.buscarTemplate = false;
					if (data.length > 0) {
						this.items = data;
						this.sinResultadosTemplate = false;
					} else {
						this.items = [];
						this.copiaNombreItemBuscar = this.nombreItemBuscar;
						this.sinResultadosTemplate = true;
					}
					this.spinner.hide();
				},
				(err) => {
					this.spinner.hide();
					if (err.status == 401) {
						this.router.navigateByUrl('login');
						this.messageService.clear();
						this.messageService.add({
							severity: 'error',
							summary: 'Sesión caducada',
							detail: 'Inicia sesión nuevamente',
							life: 3000,
						});
					} else {
						if (err.status == 0) {
							this.messageService.clear();
							this.messageService.add({
								severity: 'error',
								summary: 'Sin conexión',
								detail: 'No se pudo conectar con el servidor',
								life: 3000,
							});
						}
					}
				}
			);
		}
	}

	async obtenerFavoritos() {
		this.servicio.obtenerFavoritos().subscribe(
			(data) => {
				this.favoritos = data;
				if (data.productos.length > 0) {
					this.favoritoProductoTemplate = false;
				} else {
					this.favoritoProductoTemplate = true;
				}

				if (data.recetas.length > 0) {
					this.favoritoRecetaTemplate = false;
				} else {
					this.favoritoRecetaTemplate = true;
				}
			},
			(err) => {
				if (err.status == 401) {
					this.router.navigateByUrl('login');
					this.messageService.clear();
					this.messageService.add({
						severity: 'error',
						summary: 'Sesión caducada',
						detail: 'Inicia sesión nuevamente',
						life: 3000,
					});
				} else {
					if (err.status == 0) {
						this.messageService.clear();
						this.messageService.add({
							severity: 'error',
							summary: 'Sin conexión',
							detail: 'No se pudo conectar con el servidor',
							life: 3000,
						});
					}
				}
			}
		);
	}

	async obtenerRecetasUsuario() {
		this.spinner.show();
		this.servicio.obtenerRecetasUsuario().subscribe(
			(data) => {
				if (data.length > 0) {
					this.misRecetasTemplate = false;
					this.items = data;
				} else {
					this.misRecetasTemplate = true;
					this.items = [];
				}
				this.spinner.hide();
			},
			(err) => {
				this.spinner.hide();
				if (err.status == 401) {
					this.router.navigateByUrl('login');
					this.messageService.clear();
					this.messageService.add({
						severity: 'error',
						summary: 'Sesión caducada',
						detail: 'Inicia sesión nuevamente',
						life: 3000,
					});
				} else {
					if (err.status == 0) {
						this.messageService.clear();
						this.messageService.add({
							severity: 'error',
							summary: 'Sin conexión',
							detail: 'No se pudo conectar con el servidor',
							life: 3000,
						});
					}
				}
			}
		);
	}

	agregarProductoPlanificacion(item: FormGroup) {
		let productoAgregarPlan: ProductoAgregarPlan = {
			fecha: 'nada',
			nombre: item.get('nombre')?.value,
			id_producto: item.get('id')?.value,
			cantidad: item.get('cantidad')?.value,
			nombre_unidad: item.get('unidad')?.value.nombre,
			unidad_medida: item.get('unidad')?.value.id_unidad_medida,
			dia: this.route.snapshot.params['dia'],
			momento_dia: this.route.snapshot.params['momento'].toUpperCase(),
			kcal: '2',
			checked: false,
		};
		this.servicioComponentes.addProducto(productoAgregarPlan);
		this.router.navigateByUrl('/planificacion');
	}

	agregarRecetaPlanificacion(item: FormGroup) {
		let recetaAgregarPlan: RecetaAgregarPlan = {
			fecha: 'nada',
			dia: this.route.snapshot.params['dia'],
			momento_dia: this.route.snapshot.params['momento'].toUpperCase(),
			id_preparacion: item.get('id')?.value,
			nombre: item.get('nombre')?.value,
			cantidad: item.get('cantidad')?.value,
			kcal: '2',
			checked: false,
		};
		this.servicioComponentes.addReceta(recetaAgregarPlan);
		this.router.navigateByUrl('/planificacion');
	}

	addProductoFavoritoServicio(producto: Producto) {
		this.servicioComponentes.addProductoFavorito(producto);
	}

	addRecetaFavoritoServicio(receta: Receta) {
		this.servicioComponentes.addRecetaFavorito(receta);
	}

	agregarFavoritoProducto(producto: Producto) {
		this.servicioComponentes.addProductoFavorito({} as Producto);
		this.servicio.agregarFavoritoProducto(producto.id_producto).subscribe(
			(data) => {},
			(err) => {
				this.messageService.add({
					severity: 'error',
					summary: 'Agregar a Favoritos',
					detail:
						'El producto "' +
						producto.nombre +
						'" no se logró agregar a favoritos, intente nuevamente.',
					life: 3000,
				});
			}
		);
	}

	quitarFavoritoProducto(producto: Producto) {
		this.servicioComponentes.addProductoFavorito({} as Producto);
		this.servicio.quitarFavoritoProducto(producto.id_producto).subscribe(
			(data) => {},
			(err) => {
				this.messageService.add({
					severity: 'error',
					summary: 'Quitar de Favoritos',
					detail:
						'El producto "' +
						producto.nombre +
						'" no se logró quitar de favoritos, intente nuevamente.',
					life: 3000,
				});
			}
		);
	}

	agregarFavoritoReceta(receta: Receta) {
		this.servicioComponentes.addRecetaFavorito({} as Receta);
		this.servicio.agregarFavoritoReceta(receta.id_preparacion).subscribe(
			(data) => {},
			(err) => {
				this.messageService.add({
					severity: 'error',
					summary: 'Agregar a Favoritos',
					detail:
						'La receta "' +
						receta.nombre +
						'" no se logró agregar a favoritos, intente nuevamente.',
					life: 3000,
				});
			}
		);
	}

	quitarFavoritoReceta(receta: Receta) {
		this.servicioComponentes.addRecetaFavorito({} as Receta);
		this.servicio.quitarFavoritoReceta(receta.id_preparacion).subscribe(
			(data) => {},
			(err) => {
				this.messageService.add({
					severity: 'error',
					summary: 'Quitar de Favoritos',
					detail:
						'La receta "' +
						receta.nombre +
						'" no se logró quitar de favoritos, intente nuevamente.',
					life: 3000,
				});
			}
		);
	}

	toggleProductoArrayFavoritos(producto: Producto) {
		if (producto.favorito) {
			let elemento = document.getElementById(
				producto.id_producto + '-' + producto.nombre
			);
			if (elemento) {
				elemento.classList.add('zoom');
			}
			if (this.favoritos.productos.length == 1) {
				this.favoritoProductoTemplate = true;
			}
			producto.favorito = false;
			setTimeout(() => {
				for (let i = 0; i < this.favoritos.productos.length; i++) {
					if (
						this.favoritos.productos[i].id_producto ==
						producto.id_producto
					) {
						this.favoritos.productos.splice(i, 1);
						break;
					}
				}
			}, 150);
		} else {
			producto.favorito = true;
			let elemento = document.getElementById(
				producto.id_producto + '-' + producto.nombre
			);
			if (elemento) {
				elemento.classList.remove('zoom');
			}
			this.favoritos.productos.push(producto);
			if (this.favoritoProductoTemplate) {
				this.favoritoProductoTemplate = false;
			}
		}
	}

	toggleRecetaArrayFavoritos(receta: Receta) {
		if (receta.favorito) {
			let elemento = document.getElementById(
				receta.id_preparacion + '-' + receta.nombre
			);
			if (elemento) {
				elemento.classList.add('zoom');
			}
			if (this.favoritos.recetas.length == 1) {
				this.favoritoRecetaTemplate = true;
			}
			receta.favorito = false;
			setTimeout(() => {
				for (let i = 0; i < this.favoritos.recetas.length; i++) {
					if (
						this.favoritos.recetas[i].id_preparacion ==
						receta.id_preparacion
					) {
						this.favoritos.recetas.splice(i, 1);
						break;
					}
				}
			}, 100);
		} else {
			receta.favorito = true;
			let elemento = document.getElementById(
				receta.id_preparacion + '-' + receta.nombre
			);
			if (elemento) {
				elemento.classList.remove('zoom');
			}
			this.favoritos.recetas.push(receta);
			if (this.favoritos.recetas.length > 0) {
				this.favoritoRecetaTemplate = false;
			}
		}
	}

	ngOnDestroy() {
		if (this.tipoItem == 'favorito') {
			this.productosFavoritosSubscription.unsubscribe();
			this.recetasFavoritosSubscription.unsubscribe();
		}
	}
}
