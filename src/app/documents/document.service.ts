import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Document } from './document.model';
import { MOCKDOCUMENTS } from './MOCKDOCUMENTS';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class DocumentService {
  private documents: Document[] = [];
  documentListChangedEvent = new Subject<Document[]>();
  maxDocumentId: number = 0;

  constructor(private http: HttpClient) {
    this.http
      .get(
        'https://epbcms-3d929-default-rtdb.firebaseio.com/documents.json?auth=prP1EPQU1CCxW54gGQZDMqkmKueeIwlszuZ8tE3H'
      )
      .subscribe(
        (documents: any) => {
          this.documents = documents;
          this.maxDocumentId = this.getMaxId();
          //sort the list of documents
          this.documents.sort((a, b) => {
            if (a < b) {
              return -1;
            } else if (a > b) {
              return 1;
            }
            return 0;
          });
          //emit the next document list change event
          this.documentListChangedEvent.next(this.documents.slice());
        },
        // error method
        (error: any) => {
          //print the error to the console
          console.error(error);
        }
      );
  }

  getDocuments() {
    return this.documents.slice();
  }

  getDocument(id: string): Document {
    let document: Document = {};
    this.getDocuments().forEach((d) => {
      if (d.id == id) {
        document = d;
      }
    });
    return document;
  }

  deleteDocument(document: Document) {
    if (!document) {
      return;
    }
    const pos = this.documents.indexOf(document);
    if (pos < 0) {
      return;
    }
    this.documents.splice(pos, 1);
    this.storeDocuments();
  }

  getMaxId(): number {
    let maxId = 0;
    this.getDocuments().forEach((d: Document) => {
      let currentId = Number(d.id);
      if (currentId > maxId) {
        maxId = currentId;
      }
    });
    return maxId;
  }

  addDocument(newDocument: Document) {
    if (newDocument === undefined || null) {
      return;
    }

    this.maxDocumentId++;
    newDocument.id = this.maxDocumentId.toString();
    this.documents.push(newDocument);
    this.storeDocuments();
  }

  updateDocument(originalDocument: Document, newDocument: Document) {
    if (
      originalDocument === undefined ||
      null ||
      newDocument === undefined ||
      null
    ) {
      return;
    }

    let pos = this.documents.indexOf(originalDocument);
    if (pos < 0) {
      return;
    }

    newDocument.id = originalDocument.id;
    this.documents[pos] = newDocument;
    this.storeDocuments();
  }

  storeDocuments() {
    const documentsToSave = JSON.stringify(this.documents.slice());
    let httpHeaders = new HttpHeaders();
    httpHeaders.set('Content-Type', 'application/json');
    this.http
      .put(
        'https://epbcms-3d929-default-rtdb.firebaseio.com/documents.json?auth=prP1EPQU1CCxW54gGQZDMqkmKueeIwlszuZ8tE3H',
        documentsToSave
      )
      .subscribe(() =>
        this.documentListChangedEvent.next(this.documents.slice())
      );
  }
}
