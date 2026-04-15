import { LightningElement, wire } from 'lwc';
import { getRecord, getFieldValue } from 'lightning/uiRecordApi';
import userId from '@salesforce/user/Id';
import FIRSTNAME_FIELD from '@salesforce/schema/User.FirstName';

export default class UwDashboardHeader extends LightningElement {
    userId = userId;

    @wire(getRecord, { recordId: '$userId', fields: [FIRSTNAME_FIELD] })
    user;

    get firstName() {
        return getFieldValue(this.user.data, FIRSTNAME_FIELD) || 'there';
    }

    get logoutUrl() {
        return '/portal/secur/logout.jsp';
    }
}
