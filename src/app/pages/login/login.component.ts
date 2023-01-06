import { Component, OnInit, OnDestroy, Injectable } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import {PeticonesService} from '../../router/peticones.service';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
@Injectable({ providedIn: 'root' })
export class LoginComponent implements OnInit {
  public newUser = false;

  constructor(  public authService: PeticonesService, private fb: FormBuilder,) {

    this.loginForm = fb.group({
      correo: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }
  public loginForm: FormGroup;

  ngOnInit() {
  }
  ngOnDestroy() {
  }
  login(data){
this.authService.inicioSeccion(data.correo,data.password);
  }

}
