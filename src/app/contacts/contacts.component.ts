import { Component, Input, OnInit } from '@angular/core';
import { Contact } from './contact.model';

@Component({
  selector: 'cms-contacts',
  templateUrl: './contacts.component.html',
  styleUrls: ['./contacts.component.css']
})
export class ContactsComponent implements OnInit {
  @Input() selectedContact : Contact | undefined;
  constructor() { }

  ngOnInit(): void {
  }

}
