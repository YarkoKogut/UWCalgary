public without sharing class ProfileController {

    @AuraEnabled(cacheable=true)
    public static Contact getCurrentContact(String currentUserId) {
        if (String.isBlank(currentUserId)) return null;
        User u = [SELECT ContactId FROM User WHERE Id = :currentUserId LIMIT 1];
        if (u.ContactId == null) return null;
        return [
            SELECT Id, Phone, Household_Size__c, Annual_Income__c
            FROM Contact
            WHERE Id = :u.ContactId
            LIMIT 1
        ];
    }

    @AuraEnabled(cacheable=true)
    public static List<Case> getUserCases() {
        Id userId = UserInfo.getUserId();
        User u = [SELECT ContactId FROM User WHERE Id = :userId LIMIT 1];
        if (u.ContactId == null) return new List<Case>();
        return [
            SELECT CaseNumber, Subject, Assistance_Type__c, Status, CreatedDate
            FROM Case
            WHERE ContactId = :u.ContactId
            ORDER BY CreatedDate DESC
        ];
    }

    @AuraEnabled
    public static void saveProfile(String contactId, String phone, Decimal householdSize, Decimal annualIncome) {
        update new Contact(
            Id = contactId,
            Phone = phone,
            Household_Size__c = householdSize,
            Annual_Income__c = annualIncome
        );
    }
}
