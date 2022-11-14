import { EventEmitter, Injectable, Output } from '@angular/core';
import { Subject } from 'rxjs';
import { Message } from './message.model';
import { MOCKMESSAGES } from './MOCKMESSAGES';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  messagesListChangedEvent = new Subject<Message[]>();
  private messages: Message[] = [];
  maxMessageId:number = 0;

  constructor(private http: HttpClient) {
    this.http
      .get(
        'https://epbcms-3d929-default-rtdb.firebaseio.com/messages.json?auth=prP1EPQU1CCxW54gGQZDMqkmKueeIwlszuZ8tE3H'
      )
      .subscribe(
        (messages: any) => {
          this.messages = messages;
          this.maxMessageId = this.getMaxId();
          this.messages.sort((a, b) => {
            if (a < b) {
              return -1;
            } else if (a > b) {
              return 1;
            }
            return 0;
          });
          //emit the next list change event
          this.messagesListChangedEvent.next(this.messages.slice());
        },
        // error method
        (error: any) => {
          //print the error to the console
          console.error(error);
        }
      );
  }

  getMessages(): Message[] {
    return this.messages.slice();
  }

  getMessage(id: string): Message {
    let message:Message = {};
    this.getMessages().forEach((m) => {
      if (m.id == id) {
        message = m;
      }
    });
    return message;
  }

  getMaxId(): number {
    let maxId = 0;
    this.getMessages().forEach((c: Message) => {
      let currentId = Number(c.id);
      if (currentId > maxId) {
        maxId = currentId;
      }
    });
    return maxId;
  }

  addMessage(message: Message){
    this.messages.push(message);
    this.storeMessages();
  }

  storeMessages() {
    const messagesToSave = JSON.stringify(this.messages.slice());
    let httpHeaders = new HttpHeaders();
    httpHeaders.set('Content-Type', 'application/json');
    this.http
      .put(
        'https://epbcms-3d929-default-rtdb.firebaseio.com/messages.json?auth=prP1EPQU1CCxW54gGQZDMqkmKueeIwlszuZ8tE3H',
        messagesToSave
      )
      .subscribe(() =>
        this.messagesListChangedEvent.next(this.messages.slice())
      );
  }
}
