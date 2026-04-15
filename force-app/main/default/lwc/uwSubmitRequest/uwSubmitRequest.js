import { LightningElement, track } from 'lwc';

export default class UwSubmitRequest extends LightningElement {
    @track showFlow = false;
    @track toastVisible = false;

    handleShowFlow() {
        this.showFlow = true;
    }

    handleStatusChange(event) {
        if (event.detail.status === 'FINISHED') {
            this.showFlow = false;
            this.showToast();
            setTimeout(() => {
                window.location.reload();
            }, 2000);
        }
    }

    showToast() {
        this.toastVisible = true;
        setTimeout(() => {
            this.toastVisible = false;
        }, 4000);
    }
}
