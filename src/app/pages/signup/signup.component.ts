import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormControl, FormGroup } from '@angular/forms';
import { SignupModule } from './signup.module';
import { StepsModule } from 'primeng/steps';
import { VegiService}  from 'src/app/services/vegi.service';
import { AbstractControl } from '@angular/forms';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent{
  

  
  step = 1
  sexo: string | null = null
  objetivo: string | null = null
  target: number | null = 0
  ree: number | null = 0
  factorActividad: number = 1.2


  step1_correct:boolean = true

  value_correo: string = ''
  error_correo: boolean = false
  controlCorreo: FormControl = new FormControl('', [
    Validators.required, 
    Validators.email
  ])
  
  value_contrasena: string = ''
  error_contrasena: boolean = false
  controlContrasena: FormControl = new FormControl('', [
    Validators.required,
    Validators.maxLength(35),
    Validators.minLength(5)
  ])

  value_contrasenaConfir: string = ''
  error_contrasenaConfir: boolean = false
  controlContrasenaRep: FormControl = new FormControl('', [
    Validators.required,
    Validators.maxLength(35),
    Validators.minLength(5)
  ])

  value_nombreUsuario: string = ''
  error_nombreUsuario: boolean = false

  value_fechaNacimiento: string = ''
  error_fechaNacimiento: boolean = false

  value_peso: string = ''
  error_peso: boolean = false

  value_altura: string = ''
  error_altura: boolean = false
 

  passwordMatch(){
    if(this.value_contrasena != this.value_contrasenaConfir){
      this.error_contrasena = true
    }
    else{
      this.error_contrasena = false
    }
  }
  //controlContrasena
  
  userForm1 = this.fb.group({
    correo: ['', Validators.required],
    contrasena: ['', Validators.required],
    contrasenaRep: ['', Validators.required]
  })
  
//Se puede borrar????
  userForm2 = this.fb.group({
    nombreUsuario: ['', Validators.required],
    fechaNacimiento: ['', Validators.required],
    peso: ['', Validators.required],
    altura: ['', Validators.required],
  })
  
  //Se puede borrar fb¿¿¿ pero se deja servicio¿¿¿
  constructor(private fb: FormBuilder, private servicio:VegiService){};
  /*
  checkStep1(){
    if(this.value_contrasena != this.value_contrasenaConfir){
      this.error_contrasenaConfir = true

    }
    else{
      this.error_contrasenaConfir = false
    }
    if(this.value_correo==''){
      this.error_correo = true
    }
    else{
      this.error_correo = false
    }
    if(this.value_contrasena.length <= 5){
      this.error_contrasena = true
    }
    else{
      this.error_contrasena = false
    }

    if(!this.error_contrasena && !this.error_contrasenaConfir && !this.error_correo){
      this.step++
    }   

  }*/

  enviar(){
    let usuario = {
      //email: this.userForm1.value.correo,
      nombre: this.userForm2.value.nombreUsuario,
      //password:this.userForm1.value.contrasena,
      fecha_nacimiento: this.userForm2.value.fechaNacimiento,
      peso:this.userForm2.value.peso,
      altura:this.userForm2.value.altura,
      sexo: this.sexo,
      objetivo:this.objetivo,
      tarjet_calorias:this.target,
      es_vegano: false
    }

    this.servicio.crearUsuario(usuario).subscribe(data => {
      if(data){
        console.log('success')

      }
    })
  }

  getCaloriasMantener(){
    let peso_ = this.userForm2.value.peso || ''
    let altura_ = this.userForm2.value.altura || ''
    let edad_ = this.getAge(this.userForm2.value.fechaNacimiento)

    let ree = 0

    if(this.sexo=='MASCULINO'){
      ree = Math.round(((parseInt(peso_)*10) + (parseInt(altura_)*6.25) - (edad_*5) + 5) * this.factorActividad)
    }else{
      ree = Math.round(((parseInt(peso_)*10) + (parseInt(altura_)*6.25) - (edad_*5) - 161) * this.factorActividad)
    }

    return ree
  }


  //Nivel de ejercicio POCO O NADA, MODERADO Y ALTO
  switchObjetivo(objetivo_: string){
    this.objetivo = objetivo_

    if ((!this.userForm2.value.peso)||
          (!this.userForm2.value.altura)) {
            console.log("error")
            return
      }

      
    let caloriasMantener = this.getCaloriasMantener()
    
    if(this.objetivo == 'MANTENER'){
      this.ree = caloriasMantener
      this.target = caloriasMantener
    }
    if(this.objetivo == 'BAJAR'){
      this.ree = caloriasMantener
      this.target = caloriasMantener - 200
    }
    if(this.objetivo == 'SUBIR'){
      this.ree = caloriasMantener
      this.target = caloriasMantener + 200
    }
  }


  reasignarObjetivo(target_: any){
    let caloriasMantener = this.getCaloriasMantener()
    if(caloriasMantener > target_){
        this.objetivo = 'BAJAR'
    }
    if(caloriasMantener < target_){
      this.objetivo = 'SUBIR'
    }
    if(caloriasMantener==target_){
      this.objetivo = 'MANTENER'
    }
    console.log(target_)
  }
  switchActividad(factorActividad_: number){
    this.factorActividad = factorActividad_
  }
  switchSexo(sexo_: string){
    this.sexo = sexo_
  }
  siguiente(){
    this.step++
    console.log(this.step)
  }

  anterior(){
    this.step--
    if(this.step<0){
        this.step==0
    }
  }
  
  getAge(fechaNacimiento: any) 
{
    var today = new Date();
    var birthDate = new Date(fechaNacimiento);
    var age = today.getFullYear() - birthDate.getFullYear();
    var m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) 
    {
        age--;
    }
    return age;
}

    mostrarFecha(){
      console.log(this.userForm2.value.fechaNacimiento)
      console.log(this.getAge(this.userForm2.value.fechaNacimiento))
    }
  }
  /*registrar(){
    let usuario = {email: this.userForm.value.correo,
      password: this.userForm.value.contrasena,
      pswConf: this.userForm.value.contrasenaConfir,
      user: this.userForm.value.nombreUsuario,
      date: this.userForm.value.fechaNacimiento,
      weight: this.userForm.value.peso,
      height: this.userForm.value.altura,
      };
  }*/
