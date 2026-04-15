import { LightningElement, track } from 'lwc';
import submitDonation from '@salesforce/apex/DonationController.submitDonation';

export default class UwDonateForm extends LightningElement {
    @track currentStep = 1;
    @track frequency = 'One Time';
    @track amount = 100;
    @track selectedPreset = '100';
    @track customAmount = '';

    @track firstName = '';
    @track lastName = '';
    @track email = '';
    @track phone = '';
    @track address = '';
    @track city = '';
    @track postalCode = '';
    @track country = 'Canada';

    @track isLoading = false;
    @track isSuccess = false;
    @track step1Error = '';
    @track step2Error = '';
    @track submitError = '';

    // Step visibility
    get isStep1() { return this.currentStep === 1; }
    get isStep2() { return this.currentStep === 2; }
    get isStep3() { return this.currentStep === 3; }

    // Progress classes
    get step1Cls() { return 'progress-step active' + (this.currentStep > 1 ? ' done' : ''); }
    get step2Cls() { return 'progress-step' + (this.currentStep >= 2 ? ' active' : '') + (this.currentStep > 2 ? ' done' : ''); }
    get step3Cls() { return 'progress-step' + (this.currentStep >= 3 ? ' active' : ''); }
    get prog1Cls() { return 'progress-line' + (this.currentStep > 1 ? ' filled' : ''); }
    get prog2Cls() { return 'progress-line' + (this.currentStep > 2 ? ' filled' : ''); }

    // Frequency tab classes
    get oneTimeCls() { return 'freq-tab' + (this.frequency === 'One Time' ? ' selected' : ''); }
    get monthlyCls() { return 'freq-tab' + (this.frequency === 'Monthly' ? ' selected' : ''); }

    // Amount button classes
    get amt50Cls()   { return 'amount-btn' + (this.selectedPreset === '50'   ? ' selected' : ''); }
    get amt100Cls()  { return 'amount-btn' + (this.selectedPreset === '100'  ? ' selected' : ''); }
    get amt365Cls()  { return 'amount-btn' + (this.selectedPreset === '365'  ? ' selected' : ''); }
    get amt1200Cls() { return 'amount-btn' + (this.selectedPreset === '1200' ? ' selected' : ''); }

    get fullName() { return (this.firstName + ' ' + this.lastName).trim(); }
    get payLabel() { return this.isLoading ? 'Processing...' : 'Make a Payment'; }

    setOneTime() { this.frequency = 'One Time'; }
    setMonthly()  { this.frequency = 'Monthly'; }

    pickAmount(e) {
        this.selectedPreset = e.target.dataset.val;
        this.amount = parseFloat(this.selectedPreset);
        this.customAmount = '';
    }

    handleCustomAmount(e) {
        this.customAmount = e.target.value;
        if (this.customAmount) {
            this.selectedPreset = null;
            this.amount = parseFloat(this.customAmount) || 0;
        }
    }

    handleFirstName(e) { this.firstName = e.target.value; }
    handleLastName(e)  { this.lastName = e.target.value; }
    handleEmail(e)     { this.email = e.target.value; }
    handlePhone(e)     { this.phone = e.target.value; }
    handleAddress(e)   { this.address = e.target.value; }
    handleCity(e)      { this.city = e.target.value; }
    handlePostalCode(e){ this.postalCode = e.target.value; }
    handleCountry(e)   { this.country = e.target.value; }

    nextStep() {
        if (this.currentStep === 1) {
            if (!this.amount || this.amount <= 0) {
                this.step1Error = 'Please select or enter a donation amount.';
                return;
            }
            this.step1Error = '';
        }
        if (this.currentStep === 2) {
            if (!this.firstName || !this.lastName || !this.email) {
                this.step2Error = 'Please fill in all required fields.';
                return;
            }
            if (!this.email.includes('@')) {
                this.step2Error = 'Please enter a valid email address.';
                return;
            }
            this.step2Error = '';
        }
        this.currentStep++;
    }

    prevStep() {
        this.currentStep--;
    }

    async handleSubmit() {
        this.isLoading = true;
        this.submitError = '';
        try {
            await submitDonation({
                firstName: this.firstName,
                lastName: this.lastName,
                email: this.email,
                phone: this.phone,
                address: this.address,
                city: this.city,
                postalCode: this.postalCode,
                country: this.country,
                amount: this.amount,
                frequency: this.frequency
            });
            this.isSuccess = true;
        } catch (err) {
            this.submitError = err.body?.message || 'Submission failed. Please try again.';
        } finally {
            this.isLoading = false;
        }
    }
}
