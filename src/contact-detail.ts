import { inject } from 'aurelia-framework';
import { EventAggregator } from 'aurelia-event-aggregator';
import { WebAPI } from './web-api';
import { ContactUpdated, ContactViewed } from './messages';
import { areEqual } from './utility';

interface Contact {
  user_ID: number;
  user_firstname: string;
  user_surname: string;
  user_email: string;
}

@inject(WebAPI, EventAggregator)
export class ContactDetail {
  routeConfig;
  contact: Contact;
  originalContact: Contact;

  constructor(private api: WebAPI, private ea: EventAggregator) {
    let x = 1;
  }

  activate(params, routeConfig) {
    this.routeConfig = routeConfig;

    console.log(this);

    return this.api.getContactDetails(params.id)
      .then(contact => {
        this.contact = <Contact>contact[0];
        this.routeConfig.navModel.setTitle(this.contact.user_firstname);
        this.originalContact = JSON.parse(JSON.stringify(this.contact));
        this.ea.publish(new ContactViewed(this.contact));
        console.log(this);
      })

  }

  get canSave() {
    return this.contact.user_firstname && this.contact.user_surname && !this.api.isRequesting;
  }

  /**
   * TODO: add save back into this
   */
  // save() {
  //   this.api.saveContact(this.contact).then(contact => {
  //     this.contact = <Contact>contact;
  //     this.routeConfig.navModel.setTitle(this.contact.user_firstname);
  //     this.originalContact = JSON.parse(JSON.stringify(this.contact));
  //     this.ea.publish(new ContactUpdated(this.contact));
  //   });
  // }

  canDeactivate() {
    if (!areEqual(this.originalContact, this.contact)) {
      let result = confirm('You have unsaved changes. Are you sure you wish to leave?');

      if (!result) {
        this.ea.publish(new ContactViewed(this.contact));
      }

      return result;
    }

    return true;
  }
}