import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Contact } from '../contact.model';
import { ContactService } from '../contact.service';

@Component({
  selector: 'cms-contact-edit',
  templateUrl: './contact-edit.component.html',
  styleUrls: ['./contact-edit.component.css'],
})
export class ContactEditComponent implements OnInit {
  originalContact: Contact = {};
  contact: Contact = {};
  groupContacts: Contact[] = [];
  editMode: boolean = false;
  id: string = '';

  constructor(
    private contactService: ContactService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params: Params) => {
      const { id } = params;

      if (id == undefined || id == null) {
        this.editMode = false;
        return;
      }

      this.originalContact = this.contactService.getContact(id);
      if (this.originalContact == undefined || this.originalContact == null) {
        return;
      }
      this.editMode = true;
      this.contact = JSON.parse(JSON.stringify(this.originalContact));

      if (this.contact.group != undefined && this.contact.group.length > 0) {
        this.groupContacts = this.contact.group.slice();
      }
    });
  }

  onSubmit(form: NgForm) {}

  onRemoveItem(idx: number) {}

  onCancel() {
    this.router.navigateByUrl('/contacts');
  }
}
