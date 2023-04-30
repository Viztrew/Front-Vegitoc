import { Component } from '@angular/core';
import { FormBuilder, Validators} from '@angular/forms';

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
  constructor(private fb: FormBuilder){};

  addUser(){
    console.log(this.userForm.value);
  }
}
