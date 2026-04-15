public without sharing class CompleteProfileAction {

    public class Input {
        @InvocableVariable(required=true) public String contactId;
        @InvocableVariable public String phone;
        @InvocableVariable public String street;
        @InvocableVariable public String city;
        @InvocableVariable public String state;
        @InvocableVariable public String postalCode;
        @InvocableVariable public Decimal householdSize;
        @InvocableVariable public Decimal annualIncome;
    }

    @InvocableMethod(label='Complete Portal User Profile')
    public static void completeProfile(List<Input> inputs) {
        Input inp = inputs[0];
        update new Contact(
            Id            = inp.contactId,
            Phone         = inp.phone,
            MailingStreet = inp.street,
            MailingCity   = inp.city,
            MailingState  = inp.state,
            MailingPostalCode = inp.postalCode,
            Household_Size__c = inp.householdSize,
            Annual_Income__c  = inp.annualIncome
        );
    }
}
