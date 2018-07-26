import { Component, ElementRef, OnDestroy, ViewChild, Output, Input, EventEmitter } from '@angular/core';
import { ISubscription } from 'rxjs/Subscription';
import { ViewPdfDialogService } from  './dialog.service'

@Component({
    selector: 'ij-view-pdf-dialog',
    styleUrls: ['styles.less'],
    templateUrl: 'dialog.component.html'
})

export class ViewPdfComponent implements OnDestroy{
    dialogVisible: boolean;
    private dialogSub: ISubscription;
    public pageurl:string;
    @Input()
       set pageUrl(pageUrl)
       {
         this.pageurl = pageUrl;
       }
    constructor(private dialogSvc: ViewPdfDialogService) {
        this.dialogSub = this.dialogSvc.showDialog$.subscribe(x => {
            this.showDialog();
        });
    }

    ngOnDestroy() {
        if (this.dialogSub) {
            this.dialogSub.unsubscribe();
        }
    }
    
    showDialog() {
        this.dialogVisible = true;
    }

  

    
 
}