export const masks = {
    get phone() { return ['(', /[1-9]/, /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/]; },
    get zipCode() { return [/\d/, /\d/, /\d/, /\d/, /\d/]; },
    get year() { return [/\d/, /\d/, /\d/, /\d/]; },
    get imdbId() { return [/\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/]; }
}