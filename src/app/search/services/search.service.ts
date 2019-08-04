import { Injectable } from '@angular/core';
import { Client } from 'elasticsearch-browser';
import * as elasticsearch from 'elasticsearch-browser';

@Injectable({
  providedIn: 'root'
})
export class SearchService {

  private client: Client;
 
  private queryalldocs = {
    'query': {
      'match_all': {}
    }
  };

  constructor() {
    if (!this.client) {
      this._connect();
    }
  }
 
  private connect() {
    this.client = new Client({
      host: 'http://localhost:9200',
      log: 'trace'
    });
  }
 
  private _connect() {
    this.client = new elasticsearch.Client({
      host: 'localhost:9200',
      log: 'trace'
    });
  }
 
  isAvailable(): any {
    return this.client.ping({
      requestTimeout: Infinity,
      body: 'hello van!'
    });
  }

  create(): any {
    this.client.indices.create({
      index:'produits'
     },function(err,resp,status){
      if(err){
      console.log(err);
      }
      else{
      console.log("create",resp);
      }
     });
  }

  addDocument(): any {
    return this.client.index({
      index:'user',
      type:'user',
      body:{
      'id':'1',
      'username':'hardik',
      'email':'hardik@gmail.com',
      'profile':'.././public/assets/images/facebook.png'
      }
     },function(err,resp,status){
      console.log(resp);
     })
  }

  deleteDocument(): any {
    return this.client.delete({
      index:'user',
      type:'user',
      id: '1'
     }, function (error, response) {
      console.log(error);
     });
  }

  countDocument(): any {
    return this.client.count({
      index:'user',
      type:'user',
     },function(err,resp,status){
      console.log("user: ",resp);
     })
  }

  searchDocupment(): any {
    return this.client.search({
      index:'user',
      type:'user',
      body:{
       query:{
        regexp:{'username':'hardik'}
       },
      }
     },function(error,response,status){
      if(error){
       console.log("search error: "+error);
      }
      else{
       console.log("---Reponse---");
       console.log(response);
       console.log("---hits---");
       response.hits.hits.forEach(function(hit){
        console.log(hit);
       })
      }
     });
  }

  addToIndex(value): any {
    return this.client.create(value);
  }

  getAllDocuments(_index, _type): any {
    return this.client.search({
      index: _index,
      type: _type,
      body: this.queryalldocs,
      filterPath: ['hits.hits._source']
    });
  }

  fullTextSearch(_index, _type, _field, _queryText): any {
    return this.client.search({
      index: _index,
      type: _type,
      filterPath: ['hits.hits._source', 'hits.total', '_scroll_id'],
      body: {
        'query': {
          'match_phrase_prefix': {
            [_field]: _queryText,
          }
        }
      },
      '_source': ['libelle', 'category']
    });
  }

}
