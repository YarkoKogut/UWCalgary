import { LightningElement, wire, track } from 'lwc';
import { NavigationMixin } from 'lightning/navigation';
import userId from '@salesforce/user/Id';
import isGuest from '@salesforce/user/isGuest';
import getCurrentContact from '@salesforce/apex/ProfileController.getCurrentContact';
import saveProfile from '@salesforce/apex/ProfileController.saveProfile';

export default class UwCompleteProfile extends NavigationMixin(LightningElement) {
    @track contact;
    @track phone;
    @track householdSize;
    @track annualIncome;
    @track error;
    @track isLoading = true;

    currentUserId = userId;

    connectedCallback() {
        if (isGuest) {
            window.location.href = '/portal/login';
        }
    }

    @wire(getCurrentContact, { currentUserId: '$currentUserId' })
    wiredContact({ data, error }) {
        if (data) {
            this.isLoading = false;
            this.contact = data;
            this.phone = data.Phone;
            this.householdSize = data.Household_Size__c;
            this.annualIncome = data.Annual_Income__c;
        } else if (error) {
            this.isLoading = false;
            this.error = 'Failed to load profile: ' + (error.body?.message || JSON.stringify(error));
        } else if (data === null) {
            this.isLoading = false;
        }
        // data === undefined → loading, do nothing
    }

    handlePhone(e) { this.phone = e.target.value; }
    handleHouseholdSize(e) { this.householdSize = e.target.value; }
    handleAnnualIncome(e) { this.annualIncome = e.target.value; }

    async handleSave() {
        try {
            await saveProfile({
                contactId: this.contact.Id,
                phone: this.phone,
                householdSize: this.householdSize,
                annualIncome: this.annualIncome
            });
            this[NavigationMixin.Navigate]({
                type: 'standard__webPage',
                attributes: { url: '/portal/my-dashboard' }
            });
        } catch (err) {
            this.error = err.body?.message || 'Save failed.';
        }
    }
}
