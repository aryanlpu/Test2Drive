import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from 'auth/auth.service';
import { HomeService } from './home.service';
import { SearchCard } from 'shared/components/search-card/models';
import { ISubscription } from 'rxjs/subscription';
import { ReferProfileDialogService } from 'shared/dialogs/refer/dialog.service';
import { VerifyFacebookDialogService } from 'shared/dialogs/verify-facebook/dialog.service';

@Component({
    selector: 'ij-home',
    templateUrl: 'home.component.html',
    styleUrls: ['./styles/home.less'],
    providers: [ReferProfileDialogService, VerifyFacebookDialogService]
})
export class HomeComponent implements OnInit, OnDestroy {
    cards: SearchCard[];
    public activeTab: string = 'filmCrew'; 
    public producerActive:boolean=false;
    public filmCrewActive:boolean=true; 
    get isLoggedIn() {
        return this.authSvc.isLoggedIn;
    }

    private cardsSub: ISubscription;
    
    constructor (
        private route: ActivatedRoute,
        private authSvc: AuthService,
        private homeSvc: HomeService,
        private referDlg: ReferProfileDialogService,
        private verifyFbDlg: VerifyFacebookDialogService,
    ) { }

    ngOnInit() {
        this.getCards();
    
        this.route.queryParams
            .filter(params => params.reviewee)
            .subscribe(params => {
                if (params.reviewee) {
                    this.verifyFbDlg.showDialog(params.reviewee);
                }
            });
    }
   
    onTab(tab: string) {
        this.activeTab = tab;
        if(tab == 'producers')
        {
          this.producerActive = true;
          this.filmCrewActive = false;
        }
        else
        {
            this.filmCrewActive = true;
            this.producerActive = false;
        }
    }
    ngOnDestroy() {
        if (this.cardsSub) {
            this.cardsSub.unsubscribe();
        }
    }

    logout(): void {
        this.authSvc.logout();
    }

    onRefer($event) {
        this.referDlg.showDialog($event);
    }

    private getCards() {
        this.cardsSub = this.homeSvc.getFeaturedMembers().subscribe(data => {
            SearchCard.SetProfileImageUrl(data.cards);
            this.cards = data.cards;
        });
    }
}