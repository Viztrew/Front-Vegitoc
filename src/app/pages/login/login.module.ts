import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PrimengModule } from '../../modules/primeng.module';  //Importar componentes de Primeng
import { LoginComponent } from './login.component';            //Importar componente login.ts de pages/login
import { LoginRoutingModule } from './login-routing.module';   //Importar componente login.module.ts de pages/login
import { FormsModule } from '@angular/forms';

//Se importan para tenerlos declarados previamente y no tener problemas de compilacion ya que no existen sin las librerias
@NgModule({
	declarations: [LoginComponent],
	imports: [CommonModule, PrimengModule, LoginRoutingModule, FormsModule],
})
export class LoginModule {}
