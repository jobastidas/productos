import { Component, OnInit } from '@angular/core';
import {PeticonesService} from '../../router/peticones.service';
import { ModalDismissReasons, NgbDatepickerModule, NgbActiveModal, NgbModal, NgbModalRef  } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-categorias',
  templateUrl: './categorias.component.html',
  styleUrls: ['./categorias.component.scss'],

})
export class CategoriasComponent implements OnInit {
  
  public dataCategotias = [];
  public dataCategotias_init =[];
  public categoriaForm: FormGroup;
  submitted = false;
  idCatalogo= null;
  tituloModal  = '';
  accion = '';
  filter = new FormControl('', { nonNullable: true });
  modal : NgbModalRef;
  constructor( public authService: PeticonesService,private modalService: NgbModal,private fb: FormBuilder,
    public toster: ToastrService, public router: Router) { 

      
      this.categoriaForm = this.fb.group({
        nombre: ['', [Validators.required]],
      })
    }

  ngOnInit(): void {
    this.categorias()
  }
  updateFilter(event) {
    const val = event.target.value.toLowerCase();
    console.log( this.dataCategotias_init);

    const temp = this.dataCategotias_init.filter(function (d) {
      return d.nombre === null || d.nombre === ''  ? false 
      : d.nombre.toLowerCase().indexOf(val)  !== -1 || !val
    })   
    this.dataCategotias = temp; 
  }

  categorias(){
    this.authService.lcategorias().subscribe((res:any)=>{
      this.dataCategotias_init = res.categorias;
      this.dataCategotias =    this.dataCategotias_init 
console.log(this.dataCategotias);

    })
  }
  closeResult = '';
  modalCrear(content){
    this.tituloModal = 'Crear Catalogo';
    this.accion = 'Crear';
    this.idCatalogo = null;
      
    this.categoriaForm = this.fb.group({
      nombre: ['', [Validators.required]],
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

  modalEditar(content,data){
    
    this.tituloModal = 'Editar Catalogo';
    this.accion = 'Editar';
    this.idCatalogo = data._id;
    console.log(  this.idCatalogo );
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
    if (this.categoriaForm.valid) {
      if( this.idCatalogo != null){
        let params = { nombre :this.categoriaForm.value.nombre};
         this.authService.uCategoria(params , this.idCatalogo).subscribe((res:any)=>{
          this.toster.success('los datos fueron editados', '');
          this.categorias()
          this.modal.close();
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
        let params = { nombre :this.categoriaForm.value.nombre};
 
        this.authService.cCategoria(params).subscribe((res:any)=>{
        this.toster.success('los datos fueron guardados', '');
        this.categorias()
        this.modal.close();
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
    
    this.tituloModal = 'Desea Eliminar el Catalogo '+ data.nombre;
    this.accion = 'Eliminar';
    this.idCatalogo = data._id;
    console.log(  this.idCatalogo );
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
    this.authService.eCategoria(this.idCatalogo).subscribe((res:any)=>{
      this.toster.success('Se elimino el catalogo de forma correcta', '');
      this.categorias()
      this.modal.close();
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

}
