import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { VegiService } from 'src/app/services/vegi.service';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';

@Component({
	selector: 'app-perfil',
	templateUrl: './perfil.component.html',
	styleUrls: ['./perfil.component.scss'],
})
export class PerfilComponent {
	datosUsuario: any;
	activeButton: number = 2;
	activeButton2: number = 2;
	formulario: FormGroup = this.formBuilder.group({
	  });;
	selectedButton: string = ''; // Botón "Mantener peso" seleccionado inicialmente
	datosCargados: any = false;
	constructor(
		private servicio: VegiService,
		private router: Router,
		private mensaje: MessageService,
		private formBuilder: FormBuilder){}

		cerrarSesion(){
			this.servicio.logout();
		}

		getButtonStyle(buttonNumber: number) {
		  return buttonNumber === this.activeButton ? 'p-button-rounded p-button-secondary my-1' : 'p-button-rounded p-button-warning my-1';
		}
	  
		toggleButtonState(buttonNumber: number) {
		  this.activeButton = buttonNumber;
		}

		getButtonStyle2(buttonNumber2: number) {
			return buttonNumber2 === this.activeButton2 ? 'p-button-rounded p-button-secondary my-1' : 'p-button-rounded p-button-warning my-1';
		  }
		
		  toggleButtonState2(buttonNumber2: number) {
			this.activeButton2 = buttonNumber2;
		  }

		ngOnInit(): void {
			this.servicio.loggedIn();
			if(!this.servicio.isLoggedIn){
				this.router.navigate(['']);
			}
			this.servicio.obtenerInformacionUsuario().subscribe(
				(datos) =>{
					this.datosUsuario = datos;
					console.log(datos);
					this.formulario = this.formBuilder.group({
						nombreUsuario: this.datosUsuario[0].nombre,
						fechaNac: this.datosUsuario[0].fecha_nacimiento.split("T")[0],
						peso: [this.datosUsuario[0].peso,Validators.compose([
							Validators.pattern("^[0-9,$]*$"),
							Validators.required
						  ])],
						altura: [this.datosUsuario[0].altura,Validators.compose([
							Validators.pattern("^[0-9,$]*$"),
							Validators.required
						  ])],
						calorias: [this.datosUsuario[0].tarjet_calorias,Validators.compose([
							Validators.pattern("^[0-9,$]*$"),
							Validators.required
						  ])]
					});
					if(this.datosUsuario[0].objetivo == "BAJAR"){
						this.activeButton = 1;
					}
					if(this.datosUsuario[0].objetivo == "MANTENER"){
						this.activeButton = 2;
					}
					if(this.datosUsuario[0].objetivo == "SUBIR"){
						this.activeButton = 3;
					}
					this.datosCargados = true;
				}
			)
		}
}
