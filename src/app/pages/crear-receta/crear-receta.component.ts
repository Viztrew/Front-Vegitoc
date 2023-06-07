import { Component } from '@angular/core';
import { CrearReceta, Ingrediente, Paso } from 'src/app/interfaces/data-types';

import { MenuItem, MessageService } from 'primeng/api';
import {
	FormBuilder,
	FormControl,
	FormGroup,
	Validators,
} from '@angular/forms';
import { Subscription } from 'rxjs';
import { ComponentsService } from 'src/app/services/components.service';
import { environment } from 'src/environments/environment';
import { VegiService } from 'src/app/services/vegi.service';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
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

	infoForm!: FormGroup;

	pasosForm!: FormGroup;

	TipoItems: Array<string> = ['producto', 'favorito'];

	items!: MenuItem[];

	activeIndex: number = 0;

	numero_paso: number = 1;

	dialogIngredientes: boolean = false;

	dialogPasos: boolean = false;

	dialogConfirmar: boolean = false;

	Receta: CrearReceta = {} as CrearReceta;

	ingredientesRecetaSubscription!: Subscription;

	imagesUrl = environment.imagesUrl;

	cantidadIngredientes: number = 0;

	cantidadPasos: number = 0;

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

		this.initInfoForm();

		this.initPasosForm();

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
						if (this.Receta.lista_productos) {
							this.cantidadIngredientes =
								this.cantidadIngredientes + 1;
							this.Receta.lista_productos.push(ingrediente);
						} else {
							this.cantidadIngredientes = 1;
							this.Receta.lista_productos = [ingrediente];
						}
						this.servicioComponentes.addIngredienteReceta(
							{} as Ingrediente
						);
					}
				}
			);
	}

	onActiveIndexChange(event: any) {
		this.activeIndex = event;
	}

	onUpload(event: any) {
		for (let file of event.files) {
			this.uploadedFiles.push(file);
		}

		this.messageService.add({
			severity: 'info',
			summary: 'File Uploaded',
			detail: '',
		});
	}

	initInfoForm() {
		this.infoForm = this.formBuilder.group({
			nombre: new FormControl('', [
				Validators.required,
				Validators.maxLength(50),
				Validators.minLength(5),
			]),
		});
	}

	initPasosForm() {
		this.pasosForm = this.formBuilder.group({
			descripcion: new FormControl('', [
				Validators.required,
				Validators.maxLength(500),
				Validators.minLength(10),
			]),
		});
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
		this.initPasosForm();
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

	mostrarDialogPasos() {
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
			this.dialogPasos = true;
		}
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
				this.spinner.hide();
				this.router.navigateByUrl('info/receta/' + data.id_preparacion);
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

	ngOnDestroy() {
		this.ingredientesRecetaSubscription.unsubscribe();
	}
}
