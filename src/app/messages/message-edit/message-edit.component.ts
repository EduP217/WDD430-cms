import { Component, OnInit, ViewChild, ElementRef, Output, EventEmitter } from '@angular/core';
import { Message } from '../message.model';
import { MessageService } from '../message.service';

@Component({
  selector: 'cms-message-edit',
  templateUrl: './message-edit.component.html',
  styleUrls: ['./message-edit.component.css']
})
export class MessageEditComponent implements OnInit {
  @ViewChild('subjectInput') subjectInputRef: ElementRef;
  @ViewChild('msgTextInput') msgTextInputRef: ElementRef;

  currentSender:string = "5";

  constructor(subjectInput:ElementRef, msgTextInput:ElementRef, private messageService: MessageService) {
    this.subjectInputRef = subjectInput;
    this.msgTextInputRef = msgTextInput;
  }

  ngOnInit(): void {
  }

  onSendMessage(){
    const subject = this.subjectInputRef.nativeElement.value;
    const msgText = this.msgTextInputRef.nativeElement.value;
    const newMessage = new Message("1",subject,msgText,this.currentSender);
    this.messageService.addMessage(newMessage);
    this.onClear();
  }

  onClear(){
    this.subjectInputRef.nativeElement.value = "";
    this.msgTextInputRef.nativeElement.value = "";
    this.subjectInputRef.nativeElement.focus();
  }

}
