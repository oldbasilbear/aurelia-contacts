import { WebAPI } from './web-api';
import { EventAggregator } from 'aurelia-event-aggregator';
import { ContactUpdated, ContactViewed } from './messages';
import { inject } from 'aurelia-framework';

@inject(WebAPI, EventAggregator)
export class ContactList {
  contacts;
  selectedId = 0;

  constructor(private api: WebAPI, ea: EventAggregator) {
    // ea.subscribe(ContactViewed, msg => this.select(msg.contact));
    ea.subscribe(ContactViewed, msg => this.select(msg.contact[0]));
    ea.subscribe(ContactUpdated, msg => {
      let id = msg.contact.user_ID;
      let found = this.contacts.find(x => x.user_ID == id);
      Object.assign(found, msg.contact);
    });
    this.api = api;

  }

  created() {
    this.api.getContactList().then(contacts => this.contacts = contacts);
  }

  select(contact) {
    console.log('call: select ' + contact.user_firstname);
    this.selectedId = contact.user_ID;
    return true;
  }
}