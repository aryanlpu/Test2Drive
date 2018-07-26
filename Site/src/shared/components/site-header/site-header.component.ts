import { OnInit, Component, Input, Output, ViewChild, OnDestroy } from '@angular/core';
import { style, state, animate, transition, trigger } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ConfirmationService } from 'primeng/primeng';
import { ISubscription } from 'rxjs/Subscription';

import { SearchCriteria } from './models';
import { LookupService } from 'shared/services/lookup.service';
import { Budget } from 'shared/services/budget'
import { CrewRole } from 'shared/services/CrewRole';
import { Cities } from 'shared/services/Cities'
import { AuthService } from 'auth/auth.service';
import * as utils from 'shared/lang/object';

import 'rxjs/add/operator/first';
import { Organizations } from 'shared/services/Organizations';
import { debounce } from 'rxjs/operator/debounce';

@Component({
    selector: 'ij-site-header',
    templateUrl: 'site-header.component.html',
    styleUrls: ['./site-header.less'],
    animations: [
        trigger('fadeInOut', [
            transition(':enter', [
                style({ opacity: 0 }),
                animate(250, style({ opacity: 1 }))
            ])
        ])],
    providers: [ConfirmationService]
})
export class SiteHeaderComponent implements OnInit, OnDestroy {
    budgets: string[];
    locations: string[];
    allCities: Cities[] = [];
    allBudgets: Budget[] = [];
    allOrganizations: Organizations[] = [];
    allCitiesSuggestions: string[];
    allBudgetSuggestions: string[];
    allOrganizationSuggestions: string[];
    roles: string[] = [];
    placeholders: string[] = [];
    model = new SearchCriteria();
    isTrue: boolean = false;
    budget: boolean = true;
    city: boolean = true
    counter: number = 0;
    minusBtn: boolean = true;
    showQuickSearch: boolean = false;
    roleHasFocus: boolean = false;
    submitted: boolean = false;
    searchByOrganization: boolean = true;
    @ViewChild("quicksearch") quicksearch;
    @Input("mode") public mode: "full" | "mini" = "full";
    @Input("title") public title: string = null;

    private rolesSub: ISubscription;

    public get isLoggedIn() {
        return this.authSvc.isLoggedIn;
    }

    constructor(
        private lookupSvc: LookupService,
        private confirmSvc: ConfirmationService,
        private authSvc: AuthService,
        private router: Router,
        private route: ActivatedRoute
    ) {
        this.placeholders = [
            "1st Assistant Camera",
            "Producer",
            "Director",
            "Editor",
            "Production Designer"
        ];
    }

    ngOnInit() {
        this.getOrganizationList()
        this.rolesSub = this.lookupSvc.getSearchableCrewRoles().subscribe(roles => {
            this.roles = roles.map(r => r.label);
        });

        const criteria = SearchCriteria.FromRoute(this.route.snapshot);
        // search params not in query string
        if (!criteria.isComplete) {
            this.setDefaults();
        }
        else {
            this.model = criteria;
        }
        if (this.model.organizationName) {
            this.isTrue = true;
        }



    }

    ngOnDestroy() {
        if (this.rolesSub) {
            this.rolesSub.unsubscribe();
        }
    }

    onCitiesKeyDown(event) {
        let query = (event.query || "").toLocaleLowerCase();

        this.allCitiesSuggestions = this.allCities
            .filter(f => f.label.toLocaleLowerCase().indexOf(query) != -1)
            .map(r => r.label)
            .slice(0, 5);
    }

    onBudgetsKeyDown(event) {
        let query = (event.query || "").toLocaleLowerCase();

        this.allBudgetSuggestions = this.allBudgets
            .filter(f => f.label.toLocaleLowerCase().indexOf(query) != -1)
            .map(r => r.label)
            .slice(0, 5);
    }
    onOrganizationKeyDown(event) {
        let query = (event.query || "").toLocaleLowerCase();

        this.allOrganizationSuggestions = this.allOrganizations
            .filter(f => f.label.toLocaleLowerCase().indexOf(query) != -1)
            .map(r => r.label)
            .slice(0, 5);
    }


    onToggleQuickSearch() {
        this.showQuickSearch = !this.showQuickSearch;

        setTimeout(() => {
            if (this.showQuickSearch) {
                this.quicksearch.show();
            }
        }, 0);
    }

    onSearch(f) {
        if (!this.isLoggedIn) {
            this.confirmSvc.confirm({
                message: "We only allow logged in users to search for freelancers during our beta period. Please login, first.",
                header: "Login Required",
                rejectVisible: false,
            });

            return;
        }


        this.submitted = true;
        if (!this.isValid(f)) {
            return;
        }

        if (!this.model.budget) {
            this.city = false;
            this.budget = false;
        }
        else if (!this.model.location) {
            this.city = false;
        }
        //     if(this.model.role && this.model.budget && !this.model.location)
        //     {
        //       this.searchByOrganization = true;
        // }


        if ((!this.model.role)) {
            return false;
        }
        this.router.navigate(["/search"], { queryParams: this.model });



    }


    public onClear() {
        this.model.role = "";
        this.model.location = "";
        this.model.budget = "";
        this.model.organizationName = "";
    }


    onRoleSelect(role: string) {
        if (this.roles.includes(role)) {
            this.lookupSvc.getLocations(role).first().subscribe(locations => {
                this.locations = locations;
            });

            this.lookupSvc.getFilterBudgets(role).first().subscribe(budgets => {
                this.allBudgets = budgets;
                this.model.budget = "";
                this.model.location = "";
            });

            this.lookupSvc.getFilterWorkingCities(role).first().subscribe(workingCities => {
                this.allCities = workingCities;
            });

        }
    }

    onBudgetSelect(event) {
        this.model.location = "";

        this.lookupSvc.getWorkingCitiesByBudget(this.model.budget, this.model.role).first().subscribe(workingCities => {
            this.allCities = workingCities;
        });
    }
    onCityStateSelect(event) {

        this.lookupSvc.organizationByCities(this.model.budget, this.model.role, this.model.location).first().subscribe(organizations => {
            this.allOrganizations = organizations;
        });

    }
    private setDefaults() {
        this.model.budget = ''
        this.model.location = ''
        this.model.role = '';
    }

    private isValid(form: { valid: boolean }): boolean {
        if (!form.valid) {
            if (!this.model.role) {
                this.roleHasFocus = true;
            }
            return false;
        }
        return true;
    }
    addOrganization() {
        if (this.model.role && this.model.budget && this.model.location) {
            this.lookupSvc.organizationByCities(this.model.budget, this.model.role, this.model.location).first().subscribe(organizations => {
                this.allOrganizations = organizations;
            });
        }
        this.counter = this.counter + 1;
        if (this.counter == 1) {
            this.isTrue = true;
            this.minusBtn = false;
        }
        else if (this.counter == 0) {
            this.city = true;


        }
        else if (this.counter == -1) {
            this.isTrue = false;
            this.budget = true;
            this.minusBtn = true;

        }

    }
    getOrganizationList() {
        this.lookupSvc.organizationList().subscribe(organizations => {
            this.allOrganizations = organizations;
        });
    }

    removeOrganization() {
        this.counter = this.counter - 1;
        if (this.isTrue) {
            this.isTrue = false;
            this.minusBtn = true;
            this.model.organizationName = "";
        }
        else if (this.city) {
            this.city = false;
            this.model.location = ""

        }
        else if (this.budget) {
            this.budget = false;
            this.minusBtn = false;
            this.model.budget = "";
        }
    }

}
