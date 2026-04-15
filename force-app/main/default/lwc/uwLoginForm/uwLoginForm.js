import { LightningElement, track } from 'lwc';
import login from '@salesforce/apex/LoginController.login';

export default class UwLoginForm extends LightningElement {
    @track username = '';
    @track password = '';
    @track error;
    @track isLoading = false;

    handleUsername(e) { this.username = e.target.value; }
    handlePassword(e) { this.password = e.target.value; }

    get loginLabel() {
        return this.isLoading ? 'Signing in...' : 'Sign In';
    }

    async handleLogin() {
        if (!this.username || !this.password) {
            this.error = 'Please enter your email and password.';
            return;
        }
        this.isLoading = true;
        this.error = null;
        try {
            const redirectUrl = await login({ username: this.username, password: this.password });
            if (redirectUrl) {
                window.location.href = redirectUrl;
            } else {
                this.error = 'Invalid email or password.';
            }
        } catch (err) {
            this.error = err.body?.message || 'Login failed. Please try again.';
        } finally {
            this.isLoading = false;
        }
    }
}
