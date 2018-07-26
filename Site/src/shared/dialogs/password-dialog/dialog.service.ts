import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class PasswordDialogService {
    private showDialogSource = new Subject<string>();
    public  showDialog$ = this.showDialogSource.asObservable();
    private activeTab = new Subject<boolean>();
    public  activeTab$ = this.activeTab.asObservable();

    showDialog() {
        this.showDialogSource.next();
    }
    isActivePayment(value: boolean){
        this.activeTab.next(value);
    }
}