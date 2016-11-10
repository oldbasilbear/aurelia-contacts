import { EventAggregator } from 'aurelia-event-aggregator';
import { ContactUpdated, ContactViewed } from './messages';
import { inject } from 'aurelia-framework';

/**
 * HttpClient test - START
 */
import { HttpClient } from 'aurelia-fetch-client';

@inject(HttpClient, EventAggregator)
export class ContactList {
  contacts;
  selectedId = 0;

  constructor(private http: HttpClient, ea: EventAggregator) {
    ea.subscribe(ContactViewed, msg => this.select(msg.contact));
    ea.subscribe(ContactUpdated, msg => {
      let id = msg.contact.user_ID;
      let found = this.contacts.find(x => x.user_ID == id);
      Object.assign(found, msg.contact);
    });
    this.http = http;

  }

  created() {
    this.http.fetch('http://127.0.0.1/snbportal/test/api-users.php')
      .then(response => response.json())
      .then(data => {
        this.contacts = data;
      });
  }

  select(contact) {
    this.selectedId = contact.user_ID;
    return true;
  }
}