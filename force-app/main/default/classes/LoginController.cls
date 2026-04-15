public without sharing class LoginController {
    @AuraEnabled
    public static String login(String username, String password) {
        ApexPages.PageReference ref = Site.login(username, password, '/portal/my-dashboard');
        return ref != null ? ref.getUrl() : null;
    }
}
