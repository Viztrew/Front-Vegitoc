import { Component } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { VegiService } from 'src/app/services/vegi.service';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { async } from 'rxjs';

@Component({
	selector: 'app-login',
	templateUrl: './login.component.html',
	styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
	userForm = this.formBuilder.group({
		username: new FormControl('', [Validators.required, Validators.email]),
		'current-password': new FormControl('', [Validators.required]),
	});
	constructor(
		private formBuilder: FormBuilder,
		private servicio: VegiService,
		private router: Router,
		private mensaje: MessageService
	) {}

	ngOnInit(): void {
		this.servicio.loggedIn();
		if (this.servicio.isLoggedIn) {
			this.mensaje.clear();
			this.mensaje.add({
				severity: 'info',
				summary: 'Tu sesión ya esta iniciada',
				life: 3000,
			});
			this.router.navigate(['/planificacion']);
		}
	}

	hacerLogin() {
		let usuario = {
			email: this.userForm.get('username')?.value,
			password: this.userForm.get('current-password')?.value,
		};
		this.servicio.login(usuario).subscribe(
			(data) => {
				localStorage.setItem('session', data.token);
				this.servicio.setHttpOptions();
				this.router.navigateByUrl('planificacion');
				this.mensaje.clear();
				this.mensaje.add({
					severity: 'success',
					summary: '¡Bienvenido!',
					detail: 'Se ha iniciado sesión correctamente',
					life: 3000,
				});
			},
			(err) => {
				this.mensaje.clear();
				this.mensaje.add({
					severity: 'error',
					summary: 'Usuario o contraseña incorrecta',
					detail: 'No se ha podido iniciar sesión',
					life: 3000,
				});
			}
		);
	}
}
