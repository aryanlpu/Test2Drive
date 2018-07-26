import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';


@Injectable()
export class CancelProjectDialogService {
    
    private showDialogSource = new Subject<string>();
    private showDialogSourceId = new Subject<number>();
    public showDialog$ = this.showDialogSource.asObservable();
    public showDialogId$ = this.showDialogSourceId.asObservable();
    
    showDialog(profileSysId: string , id: number) {
        this.showDialogSource.next(profileSysId);
        this.showDialogSourceId.next(id);
    }   
}