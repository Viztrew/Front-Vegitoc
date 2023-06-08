import { Component, OnInit } from '@angular/core';
import {
	FormBuilder,
	Validators,
	FormControl,
	FormGroup,
} from '@angular/forms';
import { SignupModule } from './signup.module';
import { StepsModule } from 'primeng/steps';
import { VegiService } from 'src/app/services/vegi.service';
import { AbstractControl } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { Router } from '@angular/router';

@Component({
	selector: 'app-signup',
	templateUrl: './signup.component.html',
	styleUrls: ['./signup.component.scss'],
})
export class SignupComponent {
	//VALORES ANTIGUOS

	/*
  step1_correct:boolean = true

  //Formulario creado con variables por separado
 
  value_correo: string = ''
  error_correo: boolean = false
  
  value_contrasena: string = ''
  error_contrasena: boolean = false
  controlContrasena = new FormControl('', [
    Validators.required,
    Validators.maxLength(25),
    Validators.minLength(5)
  ])

  value_contrasenaConfir: string = ''
  error_contrasenaConfir: boolean = false
  controlContrasenaRep = new FormControl('', [
    Validators.required, 
    Validators.minLength(5), 
    Validators.maxLength(25)
  ])

  value_nombreUsuario: string = ''
  error_nombreUsuario: boolean = false

  value_fechaNacimiento: string = ''
  error_fechaNacimiento: boolean = false

  value_peso: string = ''
  error_peso: boolean = false

  value_altura: string = ''
  error_altura: boolean = false
  
*/

	step = 1;
	sexo: string | null = null;
	objetivo: string | null = null;
	target: number | null = 0;
	ree: number | null = 0;
	factorActividad: number = 1.2;
	actividad: string | null = null;

	//Formulario hecho con formbuilder de angular
	userForm1!: FormGroup;
	userForm2!: FormGroup;
	//Se puede borrar fb¿¿¿ pero se deja servicio¿¿¿
	constructor(
		private formBuilder: FormBuilder,
		private servicio: VegiService,
		private router: Router,
		private mensaje: MessageService
	) {}

	ngOnInit() {
		this.iniciarFormulario();
		this.userForm1.controls['contrasena'].valueChanges.subscribe(
			(valorCampo) => {
				if (this.userForm1.controls['contrasena'].valid) {
					this.userForm1.controls['contrasenaRep'].enable();
				} else {
					this.userForm1.controls['contrasenaRep'].disable();
				}

				if (
					valorCampo == this.userForm1.controls['contrasenaRep'].value
				) {
					this.userForm1.setErrors({ esValido: true });
				} else {
					this.userForm1.setErrors({ esValido: false });
				}
			}
		);

		this.userForm1.controls['contrasenaRep'].valueChanges.subscribe(
			(valorCampo) => {
				if (valorCampo != this.userForm1.controls['contrasena'].value) {
				}
			}
		);

		this.iniciarFormulario2();
	}

	contrasenasCoinciden(): boolean {
		const contraseña = this.userForm1.controls['contrasena'].value;
		const contraseñaRep = this.userForm1.controls['contrasenaRep'].value;
		return contraseña === contraseñaRep;
	}

	iniciarFormulario() {
		this.userForm1 = this.formBuilder.group({
			correo: new FormControl('', [
				Validators.required,
				Validators.email,
			]),
			contrasena: new FormControl('', [
				Validators.required,
				Validators.minLength(5),
				Validators.maxLength(25),
			]),
			contrasenaRep: new FormControl({ value: '', disabled: true }, [
				Validators.required,
			]),
		});
		this.userForm1.setErrors({ esValido: false });
	}

	iniciarFormulario2() {
		this.userForm2 = this.formBuilder.group({
			nombreUsuario: new FormControl('', [Validators.required]),
			fechaNacimiento: new FormControl('', [Validators.required]),
			peso: new FormControl('', [
				Validators.required,
				Validators.max(300),
				Validators.min(30),
			]),
			altura: new FormControl('', [
				Validators.required,
				Validators.min(100),
				Validators.max(300),
			]),
		});
		this.userForm2.setErrors({ esValido: false });
	}

	async enviar() {
		let usuario = {
			email: this.userForm1.value.correo,
			nombre: this.userForm2.value.nombreUsuario,
			password: this.userForm1.value.contrasena,
			fecha_nacimiento: this.userForm2.value.fechaNacimiento,
			peso: this.userForm2.value.peso,
			altura: this.userForm2.value.altura,
			sexo: this.sexo,
			nivel_actividad: this.actividad,
			objetivo: this.objetivo,
			tarjet_calorias: this.target,
			es_vegano: false,
		};

		this.servicio.crearUsuario(usuario).subscribe(
			async (data) => {
				if (data) {
					this.mensaje.clear();
					this.mensaje.add({
						severity: 'success',
						summary: '¡Cuenta registrada!',
						detail: 'Inicie sesión con su cuenta',
						life: 3000,
					});
					this.router.navigateByUrl('/login');
				} else {
					console.log('wtf');
				}
			},
			(err) => {
				console.log(err);
			}
		);
	}

	getCaloriasMantener() {
		let peso_ = this.userForm2.value.peso || '';
		let altura_ = this.userForm2.value.altura || '';
		let edad_ = this.getAge(this.userForm2.value.fechaNacimiento);

		let ree = 0;

		if (this.sexo == 'MASCULINO') {
			ree = Math.round(
				(parseInt(peso_) * 10 +
					parseInt(altura_) * 6.25 -
					edad_ * 5 +
					5) *
					this.factorActividad
			);
		} else {
			ree = Math.round(
				(parseInt(peso_) * 10 +
					parseInt(altura_) * 6.25 -
					edad_ * 5 -
					161) *
					this.factorActividad
			);
		}

		return ree;
	}

	//Nivel de ejercicio POCO O NADA, MODERADO Y ALTO
	switchObjetivo(objetivo_: string) {
		this.objetivo = objetivo_;

		if (!this.userForm2.value.peso || !this.userForm2.value.altura) {
			console.log('error');
			return;
		}

		let caloriasMantener = this.getCaloriasMantener();

		if (this.objetivo == 'MANTENER') {
			this.ree = caloriasMantener;
			this.target = caloriasMantener;
		}
		if (this.objetivo == 'BAJAR') {
			this.ree = caloriasMantener;
			this.target = caloriasMantener - 200;
		}
		if (this.objetivo == 'SUBIR') {
			this.ree = caloriasMantener;
			this.target = caloriasMantener + 200;
		}
	}

	reasignarObjetivo(target_: any) {
		let caloriasMantener = this.getCaloriasMantener();
		if (caloriasMantener > target_) {
			this.objetivo = 'BAJAR';
		}
		if (caloriasMantener < target_) {
			this.objetivo = 'SUBIR';
		}
		if (caloriasMantener == target_) {
			this.objetivo = 'MANTENER';
		}
		console.log(target_);
	}
	switchActividad(factorActividad_: number) {
		this.factorActividad = factorActividad_;
		if (this.factorActividad == 1.2) {
			this.actividad = 'BAJO';
		} else if (this.factorActividad == 1.375) {
			this.actividad = 'MODERADO';
		} else if (this.factorActividad == 1.55) {
			this.actividad = 'ALTO';
		} else {
			console.log('wtf');
		}
	}

	switchSexo(sexo_: string) {
		this.sexo = sexo_;
	}
	siguiente() {
		this.step++;
		console.log(this.step);
	}

	anterior() {
		this.step--;
		if (this.step < 0) {
			this.step == 0;
		}
	}

	getAge(fechaNacimiento: any) {
		var today = new Date();
		var birthDate = new Date(fechaNacimiento);
		var age = today.getFullYear() - birthDate.getFullYear();
		var m = today.getMonth() - birthDate.getMonth();
		if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
			age--;
		}
		return age;
	}

	mostrarFecha() {
		console.log(this.userForm2.value.fechaNacimiento);
		console.log(this.getAge(this.userForm2.value.fechaNacimiento));
	}
}
