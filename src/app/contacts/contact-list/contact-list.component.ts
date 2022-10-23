import { Component, EventEmitter, OnInit, Output } from '@angular/core';

import { Contact } from '../contact.model';
import { ContactService } from '../contact.service';

@Component({
  selector: 'cms-contact-list',
  templateUrl: './contact-list.component.html',
  styleUrls: ['./contact-list.component.css']
})
export class ContactListComponent implements OnInit {
  Contacts:Contact[] = [];
  contactId: string = '';

  constructor(private contactService: ContactService) { }

  ngOnInit(): void {
    this.Contacts = this.contactService.getContacts();
    this.contactService.ContactChangedEvent.subscribe((list) => {
      this.Contacts = list;
    });
  }

}
