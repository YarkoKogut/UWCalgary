import { LightningElement, api } from 'lwc';
import isGuest from '@salesforce/user/isGuest';

export default class UwHeroBanner extends LightningElement {
    @api title      = 'Mission: To mobilize communities for lasting social change';
    @api subtitle   = 'United Way connects individuals and families with the programs and services they need most.';
    @api tagline    = 'Community Support Portal';
    @api imageUrl   = '';

    get showDashboard() {
        return !isGuest;
    }

    get heroStyle() {
        const bg = this.imageUrl
            ? `url('${this.imageUrl}')`
            : 'linear-gradient(135deg, #003DA5 0%, #0057B8 60%, #1a73c4 100%)';
        return `background: ${bg}; background-size: cover; background-position: center;`;
    }

    get registerUrl() {
        return '/portal/SelfRegister';
    }

    get dashboardUrl() {
        return '/portal/my-dashboard';
    }
}
