import { inject } from 'aurelia-framework';
import { HttpClient } from 'aurelia-fetch-client';


let latency = 200;
let id = 0;

function getId() {
  return ++id;
}

// let contacts = [
//   {
//     id: getId(),
//     firstName: 'Roger',
//     lastName: 'Green',
//     email: 'green@inklings.com',
//     phoneNumber: '867-5309'
//   }
// ];

@inject(HttpClient)
export class WebAPI {
  isRequesting = false;

  constructor(private http: HttpClient) {
    this.http = http;
  }

  // getContactList(){
  //   this.isRequesting = true;
  //   return new Promise(resolve => {
  //     setTimeout(() => {
  //       let results = contacts.map(x =>  { return {
  //         id:x.id,
  //         firstName:x.firstName,
  //         lastName:x.lastName,
  //         email:x.email
  //       }});
  //       resolve(results);
  //       this.isRequesting = false;
  //     }, latency);
  //   });
  // }

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
      setTimeout(() => {
        let found = contacts.filter(x => x.id == id)[0];
        if (found !== undefined) {
          resolve(JSON.parse(JSON.stringify(found)));
        }
        this.isRequesting = false;
      }, latency);
    });
  }

  saveContact(contact) {
    this.isRequesting = true;
    return new Promise(resolve => {
      setTimeout(() => {
        let instance = JSON.parse(JSON.stringify(contact));
        let found = contacts.filter(x => x.id == contact.id)[0];

        if (found) {
          let index = contacts.indexOf(found);
          contacts[index] = instance;
        } else {
          instance.id = getId();
          contacts.push(instance);
        }

        this.isRequesting = false;
        resolve(instance);
      }, latency);
    });
  }
}
