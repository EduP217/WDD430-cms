import { Component, OnInit } from '@angular/core';
import { Message } from '../message.model';

@Component({
  selector: 'cms-message-list',
  templateUrl: './message-list.component.html',
  styleUrls: ['./message-list.component.css']
})
export class MessageListComponent implements OnInit {
  Messages:Message[] = [
    new Message(1, "dummy test 1", "descripcion for the dummy test 1", "user-1"),
    new Message(2, "dummy test 2", "descripcion for the dummy test 2", "user-2")
  ]

  constructor() { }

  ngOnInit(): void {
  }

  onAddMessage(message: Message){
    this.Messages.push(message);
  }

}
