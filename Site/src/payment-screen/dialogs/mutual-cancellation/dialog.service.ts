import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class MutualCancellationDialogService {
    private showDialogSource = new Subject<number>();
    public showDialog$ = this.showDialogSource.asObservable();
    
    showDialog(hireId: number) {
        this.showDialogSource.next(hireId);
    }
}