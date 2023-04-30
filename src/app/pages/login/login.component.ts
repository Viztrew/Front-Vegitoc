import { Component } from '@angular/core';
import { FormBuilder, Validators} from '@angular/forms';
import { VegiService } from 'src/app/services/vegi.service';
import  Swal  from 'sweetalert2';
import { Router } from '@angular/router';
import { PlanificacionComponent } from '../planificacion/planificacion.component';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})

export class LoginComponent {

  userForm = this.fb.group({
    usuario: ['', Validators.required],
    contrasena: ['', Validators.required],
  })
  constructor(private fb: FormBuilder, private servicio: VegiService, private router: Router){};

  hacerLogin(){
    let usuario = {email: this.userForm.value.usuario, password: this.userForm.value.contrasena};
    this.servicio.login(usuario).subscribe(data => {
      localStorage.setItem('session', data.body.token)
      this.router.navigateByUrl('planificacion')
    }, err=>{
      Swal.fire({
        icon: "error",
        text: "Usuario incorrecto",
        confirmButtonText: "Continuar"
      })
    }) 
  }
}
