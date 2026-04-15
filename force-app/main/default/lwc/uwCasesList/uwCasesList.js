import { LightningElement, track } from 'lwc';
import getUserCases from '@salesforce/apex/ProfileController.getUserCases';

const STATUS_CLASSES = {
    'New': 'badge badge-new',
    'Working': 'badge badge-working',
    'Closed': 'badge badge-closed'
};

export default class UwCasesList extends LightningElement {
    @track cases = [];
    @track error;

    connectedCallback() {
        this.loadCases();
    }

    loadCases() {
        getUserCases()
            .then(data => {
                this.cases = data.map(c => ({
                    ...c,
                    statusClass: STATUS_CLASSES[c.Status] || 'badge badge-new',
                    formattedDate: new Date(c.CreatedDate).toLocaleDateString()
                }));
            })
            .catch(err => {
                this.error = err.body?.message || 'Failed to load cases.';
            });
    }

    get hasCases() {
        return this.cases && this.cases.length > 0;
    }
}
