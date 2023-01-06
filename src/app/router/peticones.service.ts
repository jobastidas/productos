import { Injectable, OnInit, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { HttpClient, HttpParams } from '@angular/common/http';
import { GlobalConstants } from './global-constants';

@Injectable({
  providedIn: 'root'
})
export class PeticonesService {
  public showLoader: boolean = false;
    
  constructor( private toster: ToastrService,public ngZone: NgZone, public router: Router,private http: HttpClient) { }

  inicioSeccion(correo, password) {

    if (correo && password) {
      let params = { correo :correo, password: password };
      let user = this.http.post(`${GlobalConstants.apiURL}/auth/login`, params);
      this.SendVerificationUser(user);
      this.showLoader = false;
    } else {
      this.showLoader = false;
      this.ngZone.run(() => {
        this.router.navigate(['login']);
        this.toster.error('Ingresó un correo electrónico o contraseña incorrectos.');
      });
    }
    return;
  }

   //main verification function
   SendVerificationUser(user) {
    user.subscribe(res => {
      console.log(res);   
    
      if (res.usuario.rol=='ADMIN_ROLE') {
        localStorage.setItem('usuario', JSON.stringify(res.usuario));
        localStorage.setItem('token', JSON.stringify(res.token));
        this.router.navigateByUrl('/categorias');
        return;
      }else{
        this.toster.error('Rol no permitido');
        return;
      }
    }, erro => {
      console.log(erro)
      this.toster.error('Ingresó un correo electrónico o contraseña incorrectos.');
      return;
    });
  }

  lcategorias(){
    return  this.http.get(`${GlobalConstants.apiURL}/categorias`);
   }
   cCategoria(categoria){
    return this.http.post(`${GlobalConstants.apiURL}/categorias`,categoria,{
      headers: GlobalConstants.createRequestOptions(JSON.parse(localStorage.getItem('token')))
     })
   }
   uCategoria(categoria,id){

    return this.http.put(`${GlobalConstants.apiURL}/categorias/`+id,categoria,{
      headers: GlobalConstants.createRequestOptions(JSON.parse(localStorage.getItem('token')))
     })
   }
   eCategoria(id){
    return this.http.delete(`${GlobalConstants.apiURL}/categorias/`+id,{
      headers: GlobalConstants.createRequestOptions(JSON.parse(localStorage.getItem('token')))
     })
   }

   
  lusuario(){
    return  this.http.get(`${GlobalConstants.apiURL}/usuarios`);
   }

   cUsuario(usuario){
    return this.http.post(`${GlobalConstants.apiURL}/usuarios`,usuario,{
      headers: GlobalConstants.createRequestOptions(JSON.parse(localStorage.getItem('token')))
     })
   }
   uUsuario(usuario,id){

    return this.http.put(`${GlobalConstants.apiURL}/usuarios/`+id,usuario,{
      headers: GlobalConstants.createRequestOptions(JSON.parse(localStorage.getItem('token')))
     })
   }
   eUsuario(id){
    return this.http.delete(`${GlobalConstants.apiURL}/usuarios/`+id,{
      headers: GlobalConstants.createRequestOptions(JSON.parse(localStorage.getItem('token')))
     })
    }

    lProductos(){
      return  this.http.get(`${GlobalConstants.apiURL}/productos`);
     }

     cProducto(producto){
      return this.http.post(`${GlobalConstants.apiURL}/productos`,producto,{
        headers: GlobalConstants.createRequestOptions(JSON.parse(localStorage.getItem('token')))
       })
     }
     uProducto(producto,id){
  
      return this.http.put(`${GlobalConstants.apiURL}/productos/`+id,producto,{
        headers: GlobalConstants.createRequestOptions(JSON.parse(localStorage.getItem('token')))
       })
     }
     eProducto(id){
      return this.http.delete(`${GlobalConstants.apiURL}/productos/`+id,{
        headers: GlobalConstants.createRequestOptions(JSON.parse(localStorage.getItem('token')))
       })
      }
}
