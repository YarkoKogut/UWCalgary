import { LightningElement, api } from 'lwc';
import { NavigationMixin } from 'lightning/navigation';

export default class UwFlowRedirect extends NavigationMixin(LightningElement) {
    @api targetUrl = '/portal/my-dashboard';

    connectedCallback() {
        // Small delay to let the flow screen render before navigating
        setTimeout(() => {
            this[NavigationMixin.Navigate]({
                type: 'standard__webPage',
                attributes: { url: this.targetUrl }
            });
        }, 1500);
    }
}
