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
    this.http.get('http://localhost:3000/documents').subscribe(
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
    const pos = this.documents.findIndex(d => d.id === document.id);
    if (pos < 0) {
      return;
    }

    this.http.delete('http://localhost:3000/documents/' + document.id)
      .subscribe(
        (response) => {
          this.documents.splice(pos, 1);
          this.storeDocuments();
        }
      );
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

  addDocument(document: Document) {
    if (!document) {
      return;
    }

    document.id = '';
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    // add to database
    this.http
      .post<{ message: string; document: Document }>(
        'http://localhost:3000/documents',
        document,
        { headers: headers }
      )
      .subscribe((responseData) => {
        // add new document to documents
        this.documents.push(responseData.document);
        this.storeDocuments();
      });
  }

  updateDocument(originalDocument: Document, newDocument: Document) {
    if (!originalDocument || !newDocument) {
      return;
    }

    const pos = this.documents.findIndex(d => d.id === originalDocument.id);
    if (pos < 0) {
      return;
    }

    newDocument.id = originalDocument.id;
    newDocument._id = originalDocument._id;

    const headers = new HttpHeaders({'Content-Type': 'application/json'});

    // update database
    this.http.put('http://localhost:3000/documents/' + originalDocument.id,
      newDocument, { headers: headers })
      .subscribe(
        (response) => {
          this.documents[pos] = newDocument;
          this.storeDocuments();
        }
      );
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
