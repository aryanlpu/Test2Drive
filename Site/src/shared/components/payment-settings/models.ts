import { environment } from "environments/environment";
export class PersonalInformation{
        public businessStructure?: string;
        public socialSecurityOrEIN?: string;
        public w9?: string; 
} 
export class BankDetail{
       public nameOnCard?: string;
       public creditCardNumber?: string;
       public accountName?: string;
       public expirationDate?: string;
       public securityCode?: string;
       public billingState?: string;
       public billingZip?: string;
       public businessStructure?: string;
       public socialSecurityOrEIN?: string;
       public w9?: string; 
       public routing?: string;
       public accountNumber?: string;
       public conAccountNumber?: string;
       public id: string;

    
}

export class CreditCard  extends PersonalInformation{
       public nameOnCard?: string;
       public creditCardNumber?: string;
       public accountName?: string;
       public expirationDate?: string;
       public securityCode?: string;
       public billingState?: string;
        public billingZip?: string;
        public defaultType?: string;
        public id: string;
     
    
}
export class BankAccount extends PersonalInformation{
        public routing?: string;
        public accountNumber?: string;
        public conAccountNumber?: string;
        public accountName?: string;
        public defaultType?: string;
        public id: string;
      
}
export class PdfUploadResponse {
        public errors: string[];
        public error: boolean;
        public fileName: string;
}






