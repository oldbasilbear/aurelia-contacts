import {HttpClient} from 'aurelia-http-client';

let client = new HttpClient();

client.get('package.json')
  .then(data => {
      console.log(data.response);
  });