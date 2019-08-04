import { Component, OnInit, ChangeDetectorRef, Input } from '@angular/core';
import { SearchService } from '../services/search.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Produit } from '../models/produit.interface';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {

  private static readonly INDEX = 'produits';
  private static readonly TYPE = 'produit';

  produits: any[];
  private queryText = '';
  private lastKeypress = 0;

  constructor(private es: SearchService) {
   
  }
 
  ngOnInit() {
    this.es.getAllDocuments(SearchComponent.INDEX, SearchComponent.TYPE)
    .then(response => {
      this.produits = response.hits.hits;
      console.log(this.produits);
    }, error => {
      console.error(error);
    }).then(() => {
      console.log('Show produits Completed!');
    });
  }

  search($event) {
    if ($event.timeStamp - this.lastKeypress > 100) {
      this.queryText = $event.target.value;
 
      this.es.fullTextSearch(
        SearchComponent.INDEX,
        SearchComponent.TYPE,
        'libelle', this.queryText).then(
          response => {
            this.produits = response.hits.hits;
            console.log(response);
          }, error => {
            console.error(error);
          }).then(() => {
            console.log('Search Completed!');
          });
    }
 
    this.lastKeypress = $event.timeStamp;
  }

}
