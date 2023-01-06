import { Component, OnInit } from '@angular/core';
import {PeticonesService} from '../../router/peticones.service';
import { ModalDismissReasons, NgbDatepickerModule, NgbActiveModal, NgbModal, NgbModalRef  } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.scss']
})
export class UsuariosComponent implements OnInit {
 
  public data= [];
  public data_init =[];
  public categoriaForm: FormGroup;
  public UsuarioForm: FormGroup;
  submitted = false;
  id= null;
  tituloModal  = '';
  accion = '';
  filter = new FormControl('', { nonNullable: true });
  modal : NgbModalRef;
  closeResult = '';

  constructor(public authService: PeticonesService,private modalService: NgbModal,private fb: FormBuilder,
    public toster: ToastrService, public router: Router) {
      this.usuarios()

      this.UsuarioForm  = this.fb.group({
        nombre: ['', [Validators.required]],
        correo: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required]],
        rol: ['ADMIN_ROLE', [Validators.required]],
      })
     }

  ngOnInit(): void {
  }

  usuarios(){
    this.authService.lusuario().subscribe((res:any)=>{
       console.log(res);
       this.data_init = res.usuarios;
       this.data = this.data_init;
    })
  }

  updateFilter(event) {
    const val = event.target.value.toLowerCase();
console.log(this.data_init);

    const temp = this.data_init.filter(function (d) {
      return d.nombre === null || d.nombre === ''  ?        
     d.correo === null || d.correo === ''  ?false
     // d.rol=== null || d.rol === ''  ? false 
      : d.nombre.toLowerCase().indexOf(val)  !== -1 || !val
      : d.correo.toLowerCase().indexOf(val)  !== -1 || !val
    //  : d.rol.toLowerCase().indexOf(val)  !== -1 || !val
    })   
    this.data = temp; 
  }

  modalEditar(content,data){
      console.log(data);
      
    this.tituloModal = 'Editar Usuario';
    this.accion = 'Editar';
    this.id = data.uid;
  
    this.UsuarioForm  = this.fb.group({
      nombre: [data.nombre, [Validators.required]],
      correo: [data.correo, [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
      rol: ['ADMIN_ROLE', [Validators.required]],
    })
   this.modal =  this.modalService.open(content,  { size: 'lg' });
   this.modal.result.then(
    (result) => {
      this.closeResult = `Closed with: ${result}`;
    },
    (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    },)
  }

  private getDismissReason(reason: any): string {
		if (reason === ModalDismissReasons.ESC) {
			return 'by pressing ESC';
		} else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
			return 'by clicking on a backdrop';
		} else {
			return `with: ${reason}`;
		}
  }

  editarCrear(){
    if (this.UsuarioForm.valid) {
      if( this.id != null){
        let params = { nombre :this.UsuarioForm.value.nombre  ,
          correo : this.UsuarioForm.value.correo , 
          password : this.UsuarioForm.value.password ,
          rol :  this.UsuarioForm.value.rol};

         this.authService.uUsuario(params , this.id).subscribe((res:any)=>{
          this.toster.success('los datos fueron editados', '');
          this.modal.close();
          this.usuarios();
          return
         },(error:any)=>{
          console.log(error);
          if(error.status == 401){
            localStorage.setItem('token', null);
            this.router.navigateByUrl('login');
            this.toster.warning('Sección caducada');
            this.modal.close();
            return
          }
          this.toster.warning('Campos incompletos.');
         })
      }else{
        let params = { nombre :this.UsuarioForm.value.nombre  ,
           correo : this.UsuarioForm.value.correo , 
           password : this.UsuarioForm.value.password ,
           rol :  this.UsuarioForm.value.rol};
 
        this.authService.cUsuario(params).subscribe((res:any)=>{
        this.toster.success('los datos fueron guardados', '');
        this.usuarios()
        this.modal.close();
      return

        },(error:any)=>{
          console.log(error);
          if(error.status == 401){
            localStorage.setItem('token', null);
            this.router.navigateByUrl('login');
            this.toster.warning('Sección caducada');
            this.modal.close();
            return
          }
          this.toster.warning('Campos incompletos.');

        })
      }
      return
    }
    this.toster.warning('Campos incompletos.');
  }


  modalEliminar(content,data){
    
    this.tituloModal = 'Desea Eliminar el usuario '+ data.nombre;
    this.accion = 'Eliminar';
    this.id = data.uid;
    this.categoriaForm = this.fb.group({
      nombre: [data.nombre, [Validators.required]],
    })
   this.modal =  this.modalService.open(content,  { size: 'lg' });
   this.modal.result.then(
    (result) => {
      this.closeResult = `Closed with: ${result}`;
    },
    (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    },)
  }

  eliminarCatalogo(){
    this.authService.eUsuario(this.id).subscribe((res:any)=>{
      this.toster.success('Se elimino el usuario de forma correcta', '');
      this.modal.close();
      this.usuarios()
      return
     },(error:any)=>{
      console.log(error);
      if(error.status == 401){
        localStorage.setItem('token', null);
        this.router.navigateByUrl('login');
        this.toster.warning('Sección caducada');
        this.modal.close();
        return
      }
      this.toster.warning('Error al Consumir servicio.');
     })
  }

  modalCrear(content){
    this.tituloModal = 'Crear Usuario';
    this.accion = 'Crear';
    this.id = null;
      
    this.UsuarioForm  = this.fb.group({
      nombre: ['', [Validators.required]],
      correo: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
      rol: ['ADMIN_ROLE', [Validators.required]],
    })
   this.modal =  this.modalService.open(content,  { size: 'lg' });
   this.modal.result.then(
    (result) => {
      this.closeResult = `Closed with: ${result}`;
    },
    (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    },)
  }
}
