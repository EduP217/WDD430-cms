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
        'http://localhost:3000/contacts'
      )
      .subscribe(
        (data: any) => {
          this.contacts = data.contacts;
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
    this.getContacts().map((c) => {
      if (c.id === id) {
        contact = c;
      }
      return c;
    });
    return contact;
  }

  deleteContact(contact:Contact) {
    if (!contact) {
      return;
    }
    const pos = this.contacts.findIndex(c => c.id === contact.id);
    if (pos < 0) {
      return;
    }

    this.http.delete('http://localhost:3000/contacts/' + contact.id)
      .subscribe(
        (response) => {
          this.contacts.splice(pos, 1);
          this.storeContacts();
        }
      );
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

  addContact(contact: Contact) {
    if (!contact) {
      return;
    }

    console.log(contact);

    contact.id = '';
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    // add to database
    this.http
      .post<{ message: string; contact: Contact }>(
        'http://localhost:3000/contacts',
        contact,
        { headers: headers }
      )
      .subscribe((responseData) => {
        // add new contact to contacts
        this.contacts.push(responseData.contact);
        this.storeContacts();
      });
  }

  updateContact(originalContact: Contact, newContact: Contact) {
    if(!originalContact || !newContact){
      return;
    }

    const pos = this.contacts.findIndex(c => c.id === originalContact.id)
    if(pos < 0){
      return
    }

    newContact.id = originalContact.id;
    newContact._id = originalContact._id;

    const headers = new HttpHeaders({'Content-Type': 'application/json'});

    // update database
    this.http.put('http://localhost:3000/contacts/' + originalContact.id,
    newContact, { headers: headers })
      .subscribe(
        (response) => {
          this.contacts[pos] = newContact;
          this.storeContacts();
        }
      );
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
