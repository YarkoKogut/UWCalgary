public without sharing class DonationController {

    @AuraEnabled
    public static String submitDonation(
        String firstName,
        String lastName,
        String email,
        String phone,
        String address,
        String city,
        String postalCode,
        String country,
        Decimal amount,
        String frequency
    ) {
        try {
            
            Contact donor;
            List<Contact> existing = [SELECT Id, AccountId FROM Contact WHERE Email = :email LIMIT 1];
            if (!existing.isEmpty()) {
                donor = existing[0];
                donor.FirstName = firstName;
                donor.LastName = lastName;
                donor.Phone = phone;
                update donor;
            } else {
                donor = new Contact(
                    FirstName = firstName,
                    LastName = lastName,
                    Email = email,
                    Phone = phone,
                    MailingStreet = address,
                    MailingCity = city,
                    MailingPostalCode = postalCode,
                    MailingCountry = country
                );
                insert donor;
                donor = [SELECT Id, AccountId FROM Contact WHERE Id = :donor.Id];
            }

              Opportunity opp = new Opportunity(
                Name = firstName + ' ' + lastName + ' - ' + frequency + ' Gift',
                Amount = amount,
                CloseDate = Date.today(),
                StageName = 'Closed Won',
                AccountId = donor.AccountId,
                Description = frequency + ' donation of $' + amount
            );
            insert opp;

            OpportunityContactRole ocr = new OpportunityContactRole(
                OpportunityId = opp.Id,
                ContactId = donor.Id,
                Role = 'Donor',
                IsPrimary = true
            );
            insert ocr;

            return opp.Id;

        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }
}
