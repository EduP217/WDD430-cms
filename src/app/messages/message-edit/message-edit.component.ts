import { Component, OnInit, ViewChild, ElementRef, Output, EventEmitter } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { Contact } from 'src/app/contacts/contact.model';
import { ContactService } from 'src/app/contacts/contact.service';
import { Message } from '../message.model';
import { MessageService } from '../message.service';

@Component({
  selector: 'cms-message-edit',
  templateUrl: './message-edit.component.html',
  styleUrls: ['./message-edit.component.css']
})
export class MessageEditComponent implements OnInit {
  @ViewChild('f', {static: false}) f!: NgForm;
  currentSender:Contact = {};

  constructor(
    private messageService: MessageService,
    private router: Router,
    private contactService: ContactService
  ) {}

  ngOnInit(): void { }

  onSendMessage(form: NgForm){
    this.currentSender = this.contactService.getContact("5");
    let value = form.value;
    const newMessage = new Message("",value.subject,value.msgText,this.currentSender);
    this.messageService.addMessage(newMessage);
    this.onClear();
    this.router.navigateByUrl('/messages');
  }

  onClear(){
    this.f.resetForm();
  }

}
