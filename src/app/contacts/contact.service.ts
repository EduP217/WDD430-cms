import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Contact } from './contact.model';
import { MOCKCONTACTS } from './MOCKCONTACTS';

@Injectable({
  providedIn: 'root',
})
export class ContactService {
  private contacts: Contact[] = [];
  contactListChangedEvent = new Subject<Contact[]>();
  maxContactId:number = 0;

  constructor() {
    this.contacts = MOCKCONTACTS;
  }

  getContacts(): Contact[] {
    return this.contacts.slice();
  }

  getContact(id: string = ""): Contact {
    let contact:Contact = {};
    this.getContacts().forEach((c) => {
      if (c.id == id) {
        contact = c;
      }
    });
    return contact;
  }

  deleteContact(contact:Contact) {
    if (!contact) {
      return;
    }
    const pos = this.contacts.indexOf(contact);
    if (pos < 0) {
      return;
    }
    this.contacts.splice(pos, 1);
    this.contactListChangedEvent.next(this.contacts.slice());
  }

  getMaxId(): number {
    let maxId = 0;
    this.getContacts().forEach((c:Contact) => {
      let currentId = Number(c.id);
      if(currentId>maxId) {
        maxId = currentId;
      }
    });
    return maxId
  }

  addContact(newContact: Contact) {
    if(newContact === undefined || null){
      return;
    }

    this.maxContactId++;
    newContact.id = this.maxContactId.toString();
    this.contacts.push(newContact);
    this.contactListChangedEvent.next(this.contacts.slice());
  }

  updateContact(originalContact: Contact, newContact: Contact) {
    if((originalContact === undefined || null) || (newContact === undefined || null)){
      return;
    }

    let pos = this.contacts.indexOf(originalContact)
    if(pos < 0){
      return
    }

    newContact.id = originalContact.id;
    this.contacts[pos] = newContact;
    this.contactListChangedEvent.next(this.contacts.slice());
  }
}
