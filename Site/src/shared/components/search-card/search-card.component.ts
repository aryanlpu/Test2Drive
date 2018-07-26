import { Component, Input, Output, EventEmitter } from '@angular/core';
import { SearchCard } from './models';

@Component({
    selector: 'ij-search-card',
    templateUrl: './search-card.component.html',
    styleUrls: ['./styles.less']
})
export class SearchCardComponent {
    @Input('card')
    public card: SearchCard;

    @Output('onRefer') 
    public onRefer$ = new EventEmitter<string>();

    constructor() {}

    onRefer(profileSysId: string) {
        this.onRefer$.emit(profileSysId);
    }
}