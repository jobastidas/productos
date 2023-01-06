import { Component, OnInit } from '@angular/core';
import {PeticonesService} from '../../router/peticones.service';
import { ModalDismissReasons, NgbDatepickerModule, NgbActiveModal, NgbModal, NgbModalRef  } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-productos',
  templateUrl: './productos.component.html',
  styleUrls: ['./productos.component.scss']
})
export class ProductosComponent implements OnInit {

  public data= [];
  public data_init =[];
  public data_categoria =[];
  public categoriaForm: FormGroup;
  public ProductosForm: FormGroup;
  submitted = false;
  id= null;
  tituloModal  = '';
  accion = '';
  filter = new FormControl('', { nonNullable: true });
  modal : NgbModalRef;
  closeResult = '';
  constructor(public authService: PeticonesService,private modalService: NgbModal,private fb: FormBuilder,
    public toster: ToastrService, public router: Router) { 
      this.productos()
this.categoria()
      this.ProductosForm  = this.fb.group({
        nombre: ['', [Validators.required]],
        categoria: ['', [Validators.required]],
       
      })
    }

  ngOnInit(): void {
  }

  categoria(){
    this.authService.lcategorias().subscribe((res:any)=>{
      this.data_categoria = res.categorias
      console.log(this.data_categoria );
      
    })
  }
  productos(){
  this.authService.lProductos().subscribe((data:any)=>{
    this.data_init = data.productos
    this.data = this.data_init
  console.log(data.productos);
  
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
      
    this.tituloModal = 'Editar Productos';
    this.accion = 'Editar';
    this.id = data._id;
  
    this.ProductosForm  = this.fb.group({
      nombre: [data.nombre, [Validators.required]],
      categoria: [data.categoria._id, [Validators.required]],
     
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
    if (this.ProductosForm.valid) {
      if( this.id != null){
        let params = { nombre :this.ProductosForm.value.nombre  ,
          categoria : this.ProductosForm.value.categoria }

         this.authService.uProducto(params , this.id).subscribe((res:any)=>{
          this.toster.success('los datos fueron editados', '');
          this.modal.close();
          this.productos();
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
        let params = { nombre :this.ProductosForm.value.nombre  ,
          categoria : this.ProductosForm.value.categoria };
 
        this.authService.cProducto(params).subscribe((res:any)=>{
        this.toster.success('los datos fueron guardados', '');
        this.productos()
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
    
    this.tituloModal = 'Desea Eliminar el Producto '+ data.nombre;
    this.accion = 'Eliminar';
    this.id = data._id;
   
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
    this.authService.eProducto(this.id).subscribe((res:any)=>{
      this.toster.success('Se elimino el producto de forma correcta', '');
      this.modal.close();
      this.productos()
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
    this.tituloModal = 'Crear Producto';
    this.accion = 'Crear';
    this.id = null;
      
    this.ProductosForm  = this.fb.group({
      nombre: ['', [Validators.required]],
      categoria: ['', [Validators.required]],
     
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
