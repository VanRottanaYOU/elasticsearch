import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { SearchService } from '../services/search.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.css']
})
export class AddComponent implements OnInit {

  isConnected = false;
  form: FormGroup;
  status: string;

  constructor(private es: SearchService, private cd: ChangeDetectorRef) {
    this.isConnected = false;
    this.form = new FormGroup({
      index: new FormControl('produits', Validators.required),
      id: new FormControl('', Validators.required),
      libelle: new FormControl('', Validators.required),
      prix: new FormControl('', Validators.required),
      category: new FormControl('', Validators.required),
    });
  }

  ngOnInit() {
    this.es.isAvailable().then(() => {
      this.status = 'OK';
      this.isConnected = true;
    }, error => {
      this.status = 'ERROR';
      this.isConnected = false;
      console.error('Server is down', error);
    }).then(() => {
      this.cd.detectChanges();
    });
  }

  onSubmit(value) {
    this.es.addToIndex({
      index: value.index,
      type: 'produit',
      id: value.id,
      body: {
        libelle: value.libelle,
        prix: value.prix,
        category: value.category,
        published: new Date().toLocaleString()
      }
    }).then((result) => {
      console.log(result);
      alert('Document added, see log for more info');
    }, error => {
      alert('Something went wrong, see log for more info');
      console.error(error);
    });
  }

}
