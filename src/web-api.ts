import { inject } from 'aurelia-framework';
import { HttpClient, json } from 'aurelia-fetch-client';

let latency = 200;
let id = 0;

function getId() {
  return ++id;
}

@inject(HttpClient)
export class WebAPI {
  isRequesting = false;

  constructor(private http: HttpClient) {
    this.http = http;
  }

  getContactList() {
    this.isRequesting = true;
    return new Promise(resolve => {
      this.http.fetch('http://127.0.0.1/snbportal/test/api-users.php')
        .then(response => response.json())
        .then(contactsAsJsonData => {
          resolve(contactsAsJsonData);
        });
    });
  }

  getContactDetails(id) {
    this.isRequesting = true;

    return new Promise(resolve => {
      let formdata = {
        'user_ID': id
      }

      this.http.fetch('http://127.0.0.1/snbportal/test/api-users.php',
        {
          method: 'post',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' },
          body: json(formdata)
        }
      )
        .then(response => response.json())
        .then(userAsJsonData => {
          resolve(JSON.parse(JSON.stringify(userAsJsonData)));
        });

      this.isRequesting = false;
    });
  }

  // saveContact(contact) {
  //   this.isRequesting = true;
  //   return new Promise(resolve => {
  //     setTimeout(() => {
  //       let instance = JSON.parse(JSON.stringify(contact));
  //       let found = contacts.filter(x => x.id == contact.id)[0];

  //       if (found) {
  //         let index = contacts.indexOf(found);
  //         contacts[index] = instance;
  //       } else {
  //         contacts.push(instance);
  //       }

  //       this.isRequesting = false;
  //       resolve(instance);
  //     }, latency);
  //   });
  // }
}
