import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Contact } from './contact.model';
import { MOCKCONTACTS } from './MOCKCONTACTS';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class ContactService {
  private contacts: Contact[] = [];
  contactListChangedEvent = new Subject<Contact[]>();
  maxContactId:number = 0;

  constructor(private http: HttpClient) {
    this.http
      .get(
        'https://epbcms-3d929-default-rtdb.firebaseio.com/contacts.json?auth=prP1EPQU1CCxW54gGQZDMqkmKueeIwlszuZ8tE3H'
      )
      .subscribe(
        (contacts: any) => {
          this.contacts = contacts;
          this.maxContactId = this.getMaxId();
          //sort the list of contacts
          this.contacts.sort((a, b) => {
            if (a < b) {
              return -1;
            } else if (a > b) {
              return 1;
            }
            return 0;
          });
          //emit the next contact list change event
          this.contactListChangedEvent.next(this.contacts.slice());
        },
        // error method
        (error: any) => {
          //print the error to the console
          console.error(error);
        }
      );
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
    this.storeContacts();
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
    this.storeContacts();
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
    this.storeContacts();
  }

  storeContacts() {
    const contactsToSave = JSON.stringify(this.contacts.slice());
    let httpHeaders = new HttpHeaders();
    httpHeaders.set('Content-Type', 'application/json');
    this.http
      .put(
        'https://epbcms-3d929-default-rtdb.firebaseio.com/contacts.json?auth=prP1EPQU1CCxW54gGQZDMqkmKueeIwlszuZ8tE3H',
        contactsToSave
      )
      .subscribe(() =>
        this.contactListChangedEvent.next(this.contacts.slice())
      );
  }
}
