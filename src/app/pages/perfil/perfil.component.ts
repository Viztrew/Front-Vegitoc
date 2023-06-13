import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { VegiService } from 'src/app/services/vegi.service';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
	selector: 'app-perfil',
	templateUrl: './perfil.component.html',
	styleUrls: ['./perfil.component.scss'],
})
export class PerfilComponent {
	datosUsuario: any;
	activeButton: number = 2;
	activeButton2: number = 2;
	formulario: FormGroup = this.formBuilder.group({});
	selectedButton: string = ''; // Botón "Mantener peso" seleccionado inicialmente
	datosCargados: any = false;
	constructor(
		private servicio: VegiService,
		private router: Router,
		private messageService: MessageService,
		private formBuilder: FormBuilder,
		private spinner: NgxSpinnerService
	) {}

	guardarInformacion() {
		let nombre = this.formulario.get('nombreUsuario')?.value;
		let fecha_nacimiento = this.datosUsuario[0].fecha_nacimiento;
		let peso = this.formulario.get('peso')?.value;
		let altura = this.formulario.get('altura')?.value;
		let calorias = this.formulario.get('calorias')?.value;
		let objetivo;
		let nivel_act;
		if (this.activeButton == 1) {
			objetivo = 'BAJAR';
		}
		if (this.activeButton == 2) {
			objetivo = 'MANTENER';
		}
		if (this.activeButton == 3) {
			objetivo = 'SUBIR';
		}

		if (this.activeButton2 == 1) {
			nivel_act = 'BAJO';
		}
		if (this.activeButton2 == 2) {
			nivel_act = 'MODERADO';
		}
		if (this.activeButton2 == 3) {
			nivel_act = 'ALTO';
		}

		let infoUsuario = {
			nombre: nombre,
			fecha_nacimiento: fecha_nacimiento,
			peso: peso,
			altura: altura,
			tarjet_calorias: calorias,
			objetivo: objetivo,
			es_vegano: false,
			nivel_actividad: nivel_act,
		};

		this.servicio
			.editarInformacionUsuario(infoUsuario)
			.subscribe((data) => {
				if (data) {
					this.messageService.clear();
					this.messageService.add({
						severity: 'success',
						summary: '¡La información se guardó correctamente!',
						life: 3000,
					});
				} else {
					this.messageService.clear();
					this.messageService.add({
						severity: 'error',
						summary: '¡No se pudo guardar la información!',
						life: 3000,
					});
				}
			});
	}

	cambiarValor(flag: any) {
		// Realiza las operaciones necesarias para cambiar el valor según el valor del input
		if (
			(!this.formulario.get('peso')?.invalid &&
				this.formulario.get('peso')?.dirty) ||
			(!this.formulario.get('altura')?.invalid &&
				this.formulario.get('altura')?.dirty) ||
			flag == 1
		) {
			const control = this.formulario.get('calorias');
			const peso = this.formulario.get('peso');
			const altura = this.formulario.get('altura');
			let fechaNac = this.datosUsuario[0].fecha_nacimiento.split('T')[0];
			fechaNac = fechaNac.split('-')[0];
			let fechaAct = new Date().getFullYear();
			let difAnos = fechaAct - fechaNac;
			let formula = 0;
			if (this.datosUsuario[0].sexo == 'MASCULINO') {
				formula =
					10 * peso?.value + 6.25 * altura?.value - 5 * difAnos + 5;
				if (this.activeButton2 == 1) {
					formula = formula * 1.2;
				}
				if (this.activeButton2 == 2) {
					formula = formula * 1.375;
				}
				if (this.activeButton2 == 3) {
					formula = formula * 1.55;
				}
				if (this.activeButton == 1) {
					formula = formula * 0.95;
				}
				if (this.activeButton == 3) {
					formula = formula * 1.05;
				}
			} else {
				let formula =
					10 * peso?.value + 6.25 * altura?.value - 5 * difAnos - 161;
				if (this.activeButton2 == 1) {
					formula = formula * 1.2;
				}
				if (this.activeButton2 == 2) {
					formula = formula * 1.375;
				}
				if (this.activeButton2 == 3) {
					formula = formula * 1.55;
				}
				if (this.activeButton == 1) {
					formula = formula * 0.95;
				}
				if (this.activeButton == 3) {
					formula = formula * 1.05;
				}
			}
			control?.setValue(Math.trunc(formula));
		}
	}

	cambiarValor2() {
		if (this.formulario.dirty) {
			const control = this.formulario.get('calorias');
			const peso = this.formulario.get('peso');
			const altura = this.formulario.get('altura');
			let fechaNac = this.datosUsuario[0].fecha_nacimiento.split('T')[0];
			fechaNac = fechaNac.split('-')[0];
			let fechaAct = new Date().getFullYear();
			let difAnos = fechaAct - fechaNac;
			let formula = 0;
			if (peso?.value == '' || altura?.value == '') {
				this.messageService.clear();
				this.messageService.add({
					severity: 'error',
					summary: 'Los datos de peso y edad no pueden estar vacíos',
					life: 3000,
				});
			} else if (this.datosUsuario[0].sexo == 'MASCULINO') {
				formula =
					10 * peso?.value + 6.25 * altura?.value - 5 * difAnos + 5;
				if (this.activeButton2 == 1) {
					formula = formula * 1.2;
				}
				if (this.activeButton2 == 2) {
					formula = formula * 1.375;
				}
				if (this.activeButton2 == 3) {
					formula = formula * 1.55;
				}
				if (this.activeButton == 1) {
					formula = formula * 0.95;
				}
				if (this.activeButton == 3) {
					formula = formula * 1.05;
				}
			} else {
				let formula =
					10 * peso?.value + 6.25 * altura?.value - 5 * difAnos - 161;
				if (this.activeButton2 == 1) {
					formula = formula * 1.2;
				}
				if (this.activeButton2 == 2) {
					formula = formula * 1.375;
				}
				if (this.activeButton2 == 3) {
					formula = formula * 1.55;
				}
				if (this.activeButton == 1) {
					formula = formula * 0.95;
				}
				if (this.activeButton == 3) {
					formula = formula * 1.05;
				}
			}
			console.log(formula - control?.value);
			if (formula - control?.value > -200) {
				this.activeButton = 1;
			}
			if (formula - control?.value < 200) {
				this.activeButton = 3;
			}
			if (
				!(formula - control?.value < -200) &&
				!(formula - control?.value > 200)
			) {
				this.activeButton = 2;
			}
		}
	}

	cerrarSesion() {
		this.servicio.logout();
	}

	getButtonStyle(buttonNumber: number) {
		return buttonNumber === this.activeButton
			? 'p-button-rounded p-button-secondary my-1'
			: 'p-button-rounded p-button-warning my-1';
	}

	toggleButtonState(buttonNumber: number) {
		this.activeButton = buttonNumber;
	}

	getButtonStyle2(buttonNumber2: number) {
		return buttonNumber2 === this.activeButton2
			? 'p-button-rounded p-button-secondary my-1'
			: 'p-button-rounded p-button-warning my-1';
	}

	toggleButtonState2(buttonNumber2: number) {
		this.activeButton2 = buttonNumber2;
	}

	obtenerInformacionUsuario() {
		this.spinner.show();
		this.servicio.obtenerInformacionUsuario().subscribe(
			(datos) => {
				this.datosUsuario = datos;
				this.formulario = this.formBuilder.group({
					nombreUsuario: this.datosUsuario[0].nombre,
					sexo: this.datosUsuario[0].sexo.toLowerCase(),
					fechaNac:
						this.datosUsuario[0].fecha_nacimiento.split('T')[0],
					peso: [
						this.datosUsuario[0].peso,
						Validators.compose([
							Validators.pattern('^[0-9,$]*$'),
							Validators.required,
						]),
					],
					altura: [
						this.datosUsuario[0].altura,
						Validators.compose([
							Validators.pattern('^[0-9,$]*$'),
							Validators.required,
						]),
					],
					calorias: [
						this.datosUsuario[0].tarjet_calorias,
						Validators.compose([
							Validators.pattern('^[0-9,$]*$'),
							Validators.required,
						]),
					],
				});
				if (this.datosUsuario[0].objetivo == 'BAJAR') {
					this.activeButton = 1;
				}
				if (this.datosUsuario[0].objetivo == 'MANTENER') {
					this.activeButton = 2;
				}
				if (this.datosUsuario[0].objetivo == 'SUBIR') {
					this.activeButton = 3;
				}

				if (this.datosUsuario[0].nivel_actividad == 'BAJO') {
					this.activeButton2 = 1;
				}
				if (this.datosUsuario[0].nivel_actividad == 'MODERADO') {
					this.activeButton2 = 2;
				}
				if (this.datosUsuario[0].nivel_actividad == 'ALTO') {
					this.activeButton2 = 3;
				}
				this.datosCargados = true;
				this.spinner.hide();
			},
			(err) => {
				this.spinner.hide();
			}
		);
	}

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

		this.obtenerInformacionUsuario();
	}
}
