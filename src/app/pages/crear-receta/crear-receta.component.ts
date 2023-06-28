import { Component, ViewChild } from '@angular/core';
import { CrearReceta, Ingrediente, Paso } from 'src/app/interfaces/data-types';

import { MenuItem, MessageService } from 'primeng/api';
import {
	FormBuilder,
	FormControl,
	FormGroup,
	Validators,
} from '@angular/forms';
import { Subscription, TimeoutError } from 'rxjs';
import { ComponentsService } from 'src/app/services/components.service';
import { environment } from 'src/environments/environment';
import { VegiService } from 'src/app/services/vegi.service';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { DialogVerProductoComponent } from 'src/app/components/dialog-ver-producto/dialog-ver-producto.component';
import { DialogAgregarComponent } from 'src/app/components/dialog-agregar/dialog-agregar.component';
@Component({
	selector: 'app-crear-receta',
	templateUrl: './crear-receta.component.html',
	styleUrls: ['./crear-receta.component.scss'],
})
export class CrearRecetaComponent {
	constructor(
		private messageService: MessageService,
		private formBuilder: FormBuilder,
		private servicioComponentes: ComponentsService,
		private servicio: VegiService,
		private router: Router,
		private spinner: NgxSpinnerService
	) {}
	uploadedFiles: any[] = [];

	infoForm: FormGroup = this.formBuilder.group({
		imagen: new FormControl('./assets/img/placeholder-image.jpg', [
			Validators.required,
		]),
		nombre: new FormControl('', [
			Validators.required,
			Validators.maxLength(50),
			Validators.minLength(5),
		]),
	});

	@ViewChild(DialogVerProductoComponent) dialogVerProductoChild: any;

	@ViewChild(DialogAgregarComponent) dialogAgregarChild: any;

	pasosForm!: FormGroup;

	TipoItems: Array<string> = ['producto', 'favorito'];

	items!: MenuItem[];

	activeIndex: number = 0;

	numero_paso: number = 1;

	dialogIngredientes: boolean = false;

	dialogPasos: boolean = false;

	dialogConfirmar: boolean = false;

	dialogVerProducto: boolean = false;

	dialogEditarIngrediente: boolean = false;

	ingredienteEditar!: Ingrediente;

	pasoEditar!: Paso;

	editarPaso: boolean = false;

	labelDialogPasos: string = 'Agregar';

	idProductoVer!: string;

	Receta: CrearReceta = {} as CrearReceta;

	ingredientesRecetaSubscription!: Subscription;

	imagesUrl = environment.imagesUrl;

	cantidadIngredientes: number = 0;

	cantidadPasos: number = 0;

	imagen!: string;

	imgFile!: any;

	async ngOnInit() {
		this.imagen = this.infoForm.controls['imagen'].value;

		await this.verificarLogin();

		await this.initInfoForm();

		await this.initPasosForm(false);

		this.items = [
			{
				label: 'Información',
			},
			{
				label: 'Ingredientes',
			},
			{
				label: 'Pasos',
			},
			{
				label: 'Resumen',
			},
		];

		this.ingredientesRecetaSubscription =
			this.servicioComponentes.ingredienteRecetas$.subscribe(
				(ingrediente) => {
					if (ingrediente?.id_producto) {
						this.dialogIngredientes = false;
						this.dialogEditarIngrediente = false;
						if (this.Receta.lista_productos) {
							if (ingrediente.editar) {
								this.editarIngredienteArray(ingrediente);
							} else {
								if (
									this.validarIngredienteRepetido(
										ingrediente.id_producto
									)
								) {
									this.messageService.clear();
									this.messageService.add({
										severity: 'info',
										summary: '¡Ingrediente repetido!',
										detail: 'No puedes agregar el mismo producto mas de una vez.',
										life: 4000,
									});
								} else {
									this.cantidadIngredientes =
										this.cantidadIngredientes + 1;
									this.Receta.lista_productos.push(
										ingrediente
									);
									this.messageService.clear();
									this.messageService.add({
										severity: 'success',
										summary: '¡Ingrediente agregado!',
										detail:
											'El ingrediente ' +
											ingrediente.nombre_producto +
											' ha sido agregado exitosamente.',
										life: 3000,
									});
								}
							}
						} else {
							this.cantidadIngredientes = 1;
							this.Receta.lista_productos = [ingrediente];
							this.messageService.clear();
							this.messageService.add({
								severity: 'success',
								summary: '¡Ingrediente agregado!',
								detail:
									'El ingrediente ' +
									ingrediente.nombre_producto +
									' ha sido agregado exitosamente.',
								life: 3000,
							});
						}
						this.servicioComponentes.addIngredienteReceta(
							{} as Ingrediente
						);
					}
				}
			);
	}

	async verificarLogin() {
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
	}

	validarIngredienteRepetido(id_ingrediente: string): boolean {
		for (let i = 0; i < this.Receta.lista_productos?.length; i++) {
			if (id_ingrediente == this.Receta.lista_productos[i].id_producto) {
				return true;
			}
		}
		return false;
	}

	onActiveIndexChange(event: any) {
		this.activeIndex = event;
	}

	cambiarFoto($event: any) {
		const [file] = $event.target.files;
		let extension = 'jpg';
		let nombreFinal = 'foto' + '.' + extension;

		this.imgFile = {
			fileRaw: file,
			fileName: nombreFinal,
		};
	}

	validateImageSize(event: any) {
		const file = event.target.files[0];
		const maxSizeInBytes = 1024 * 1024; // Tamaño máximo permitido en bytes (1MB)

		if (file.size > maxSizeInBytes) {
			alert('El tamaño de la imagen supera el límite permitido.');
			// Borra el valor del input
		}
	}

	onSelect(event: any) {
		let maxSizeInBytes = 1024 * 1024;
		const file = event.target.files[0];
		if (file) {
			if (file.size <= maxSizeInBytes) {
				var reader = new FileReader();
				reader.readAsDataURL(file);
				reader.onload = (events: any) => {
					this.imagen = events.target.result;
					this.infoForm.controls['imagen'].setValue(this.imagen);
				};
				this.cambiarFoto(event);
			} else {
				this.messageService.add({
					severity: 'info',
					summary: 'Imagen muy pesada',
					detail: 'El tamaño de la imagen no debe superar 1MB',
					life: 3000,
				});
				this.infoForm.controls['imagen'].setValue('');
				this.imagen = './assets/img/placeholder-image.jpg';
				event.target.value = '';
			}
		} else {
			this.infoForm.controls['imagen'].setValue('');
			this.imagen = './assets/img/placeholder-image.jpg';
			event.target.value = '';
		}
	}

	enviarFoto() {
		const body = new FormData();
		body.append('myFile', this.imgFile.fileRaw, this.imgFile.fileName);
		this.servicio.guardarFotoReceta(body).subscribe((valor) => {
			if (valor) {
			}
		});
	}

	async initInfoForm() {
		this.infoForm = this.formBuilder.group({
			imagen: new FormControl('', [Validators.required]),
			nombre: new FormControl('', [
				Validators.required,
				Validators.maxLength(50),
				Validators.minLength(5),
			]),
		});
	}

	async initPasosForm(editar: boolean) {
		if (editar) {
			this.pasosForm = this.formBuilder.group({
				descripcion: new FormControl(
					{ value: this.pasoEditar.descripcion, disabled: false },
					[
						Validators.required,
						Validators.maxLength(500),
						Validators.minLength(10),
					]
				),
			});
		} else {
			this.pasosForm = this.formBuilder.group({
				descripcion: new FormControl('', [
					Validators.required,
					Validators.maxLength(500),
					Validators.minLength(10),
				]),
			});
		}
	}

	addIngredienteReceta(ingrediente: Ingrediente) {
		this.servicioComponentes.addIngredienteReceta(ingrediente);
	}

	editarIngredienteArray(ingrediente: Ingrediente) {
		for (let i = 0; i < this.Receta.lista_productos.length; i++) {
			if (
				ingrediente.id_producto ==
				this.Receta.lista_productos[i].id_producto
			) {
				this.Receta.lista_productos.splice(i, 1, ingrediente);
				break;
			}
		}
		this.messageService.clear();
		this.messageService.add({
			severity: 'success',
			summary: '¡Ingrediente editado!',
			detail:
				'El ingrediente ' +
				ingrediente.nombre_producto +
				' ha sido editado exitosamente.',
			life: 3000,
		});
	}

	eliminarIngredienteArray(ingrediente: Ingrediente) {
		let elemento = document.getElementById(ingrediente.id_producto);
		if (elemento) {
			elemento.classList.add('zoom');
		}
		if (this.Receta.lista_productos.length == 1) {
			this.Receta.lista_productos.splice(0, 1);
			this.cantidadIngredientes = this.cantidadIngredientes - 1;
		} else {
			setTimeout(() => {
				for (let i = 0; i < this.Receta.lista_productos?.length; i++) {
					if (
						ingrediente.id_producto ==
						this.Receta.lista_productos[i].id_producto
					) {
						this.Receta.lista_productos.splice(i, 1);
						this.cantidadIngredientes =
							this.cantidadIngredientes - 1;
						break;
					}
				}
			}, 100);
		}
		this.messageService.clear();
		this.messageService.add({
			severity: 'success',
			summary: '¡Ingrediente eliminado!',
			detail:
				'El ingrediente ' +
				ingrediente.nombre_producto +
				' ha sido eliminado exitosamente.',
			life: 3000,
		});
	}

	eliminarPasoArray(paso: Paso) {
		let elemento = document.getElementById(paso.n_paso.toString());
		if (elemento) {
			elemento.classList.add('zoom');
		}
		if (this.Receta.pasos?.length == 1) {
			this.Receta.pasos.splice(0, 1);
			this.cantidadPasos = this.cantidadPasos - 1;
			this.setNumeroPasosArray();
		} else {
			setTimeout(() => {
				for (let i = 0; i < this.Receta.pasos?.length; i++) {
					if (paso.n_paso == this.Receta.pasos[i].n_paso) {
						this.Receta.pasos.splice(i, 1);
						this.cantidadPasos = this.cantidadPasos - 1;
						this.setNumeroPasosArray();
						break;
					}
				}
			}, 100);
		}
		this.messageService.clear();
		this.messageService.add({
			severity: 'success',
			summary: '¡Paso eliminado!',
			detail:
				'El paso ' + paso.n_paso + ' ha sido eliminado exitosamente.',
			life: 3000,
		});
	}

	setNumeroPasosArray() {
		let n_paso = 1;
		for (let i = 0; i < this.Receta.pasos?.length; i++) {
			this.Receta.pasos[i].n_paso = n_paso;
			n_paso = n_paso + 1;
		}
		this.numero_paso = n_paso;
	}

	agregarPasoReceta() {
		this.dialogPasos = false;
		let paso: Paso = {
			n_paso: this.numero_paso,
			descripcion: this.pasosForm.get('descripcion')?.value,
		};
		if (this.Receta.pasos) {
			this.cantidadPasos = this.cantidadPasos + 1;
			this.Receta.pasos.push(paso);
		} else {
			this.cantidadPasos = 1;
			this.Receta.pasos = [paso];
		}
		this.numero_paso = this.numero_paso + 1;
		this.initPasosForm(false);

		this.messageService.clear();
		this.messageService.add({
			severity: 'success',
			summary: '¡Paso agregado!',
			detail:
				'El paso ' + paso.n_paso + ' ha sido agregado exitosamente.',
			life: 3000,
		});
	}

	editarPasoReceta() {
		this.dialogPasos = false;
		this.editarPaso = false;
		let paso: Paso = {
			n_paso: this.pasoEditar.n_paso,
			descripcion: this.pasosForm.get('descripcion')?.value,
		};
		for (let i = 0; i < this.Receta.pasos.length; i++) {
			if (this.pasoEditar.n_paso == this.Receta.pasos[i].n_paso) {
				this.Receta.pasos.splice(i, 1, paso);
				break;
			}
		}
		this.messageService.clear();
		this.messageService.add({
			severity: 'success',
			summary: '¡Paso editado!',
			detail: 'El paso ' + paso.n_paso + ' ha sido editado exitosamente.',
			life: 3000,
		});
		this.initPasosForm(false);
	}

	mostrarDialogIngredientes() {
		if (this.cantidadIngredientes >= 10) {
			this.dialogIngredientes = false;
			this.messageService.clear();
			this.messageService.add({
				severity: 'info',
				summary: 'Límite de Ingredientes alcanzado',
				detail: 'Solo puedes agregar un máximo de 10 ingredientes',
				life: 3000,
			});
		} else {
			this.dialogIngredientes = true;
		}
	}

	async mostrarDialogEditarIngrediente() {
		if (this.dialogAgregarChild) {
			this.dialogEditarIngrediente = false;
			setTimeout(() => {
				this.dialogEditarIngrediente = true;
			}, 100);
		} else {
			this.dialogEditarIngrediente = true;
		}
	}

	editarIngrediente(ingrediente: Ingrediente) {
		this.ingredienteEditar = ingrediente;
		this.mostrarDialogEditarIngrediente();
	}

	mostrarDialogPasos() {
		this.labelDialogPasos = 'Agregar';
		this.editarPaso = false;
		if (this.cantidadPasos >= 15) {
			this.dialogPasos = false;
			this.messageService.clear();
			this.messageService.add({
				severity: 'info',
				summary: 'Límite de Pasos alcanzado',
				detail: 'Solo puedes agregar un máximo de 15 pasos',
				life: 3000,
			});
		} else {
			this.initPasosForm(false);
			this.dialogPasos = true;
		}
	}

	mostrarDialogPasosEditar(paso: Paso) {
		this.labelDialogPasos = 'Aceptar';
		this.dialogPasos = true;
		this.editarPaso = true;
		this.pasoEditar = paso;
		this.initPasosForm(true);
	}

	mostrarDialogConfirmar() {
		this.dialogConfirmar = true;
	}

	cerrarDialogConfirmar() {
		this.dialogConfirmar = false;
	}

	atras() {
		this.activeIndex = this.activeIndex - 1;
	}

	siguiente() {
		if (this.activeIndex == 0) {
			this.Receta.nombre = this.infoForm.get('nombre')?.value;
		}
		this.activeIndex = this.activeIndex + 1;
	}

	disableBotonSiguiente(): boolean {
		switch (this.activeIndex) {
			case 0:
				if (this.infoForm.valid) {
					return false;
				} else {
					return true;
				}
			case 1:
				if (this.cantidadIngredientes > 0) {
					return false;
				} else {
					return true;
				}
			case 2:
				if (this.cantidadPasos > 0) {
					return false;
				} else {
					return true;
				}
			case 3:
				return false;

			default:
				return true;
		}
	}

	crearReceta() {
		this.spinner.show();
		this.servicio.crearReceta(this.Receta).subscribe(
			(data) => {
				this.enviarFoto();
				this.spinner.hide();
				this.router.navigateByUrl('mis-recetas');
				this.messageService.clear();
				this.messageService.add({
					severity: 'success',
					summary: '¡Receta creada!',
					detail:
						'La receta ' +
						this.Receta.nombre +
						' ha sido creada exitosamente.',
					life: 3000,
				});
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
				} else if (err.status == 0) {
					this.messageService.clear();
					this.messageService.add({
						severity: 'error',
						summary: 'Sin conexión',
						detail: 'No se pudo conectar con el servidor',
						sticky: true,
					});
				} else if (err instanceof TimeoutError) {
					this.messageService.clear();
					this.messageService.add({
						severity: 'error',
						summary: 'Timeout',
						detail: 'Se excedió el tiempo de espera máximo de respuesta',
						sticky: true,
					});
				} else {
					this.messageService.clear();
					this.messageService.add({
						severity: 'error',
						summary: 'Error desconocido',
						detail: 'Se produjo un error desconocido, intente nuevamente.',
						sticky: true,
					});
				}
			}
		);
	}

	mostrarDialogVerProducto() {
		if (this.dialogVerProductoChild) {
			this.dialogVerProductoChild.visible = true;
		} else {
			this.dialogVerProducto = true;
		}
	}

	verProducto(producto: Ingrediente) {
		this.idProductoVer = producto.id_producto;
		this.mostrarDialogVerProducto();
	}

	ngOnDestroy() {
		this.ingredientesRecetaSubscription.unsubscribe();
	}
}
