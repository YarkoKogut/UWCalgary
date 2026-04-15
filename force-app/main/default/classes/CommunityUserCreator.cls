public without sharing class CommunityUserCreator {

    public class CreateUserInput {
        @InvocableVariable(label='First Name' required=true)
        public String firstName;

        @InvocableVariable(label='Last Name' required=true)
        public String lastName;

        @InvocableVariable(label='Email' required=true)
        public String email;

        @InvocableVariable(label='Contact Id' required=true)
        public String contactId;
    }

    public class CreateUserOutput {
        @InvocableVariable(label='User Id')
        public String userId;

        @InvocableVariable(label='Error Message')
        public String errorMessage;
    }

    @InvocableMethod(label='Create Community Portal User' description='Creates a portal user linked to a Contact')
    public static List<CreateUserOutput> createUser(List<CreateUserInput> inputs) {
        List<CreateUserOutput> outputs = new List<CreateUserOutput>();

        for (CreateUserInput inp : inputs) {
            CreateUserOutput out = new CreateUserOutput();
            try {
                Profile portalProfile = [
                    SELECT Id FROM Profile
                    WHERE Name = 'Customer Community Login User'
                    LIMIT 1
                ];

                String alias = (inp.firstName.left(1) + inp.lastName.left(7)).toLowerCase();
                String username = inp.email + '.portal';

                User u = new User(
                    FirstName    = inp.firstName,
                    LastName     = inp.lastName,
                    Email        = inp.email,
                    Username     = username,
                    Alias        = alias,
                    ProfileId    = portalProfile.Id,
                    ContactId    = inp.contactId,
                    IsActive     = true,
                    EmailEncodingKey  = 'UTF-8',
                    LanguageLocaleKey = 'en_US',
                    LocaleSidKey      = 'en_US',
                    TimeZoneSidKey    = 'America/Chicago'
                );

                insert u;
                out.userId = u.Id;

            } catch (Exception e) {
                out.errorMessage = e.getMessage();
            }

            outputs.add(out);
        }

        return outputs;
    }
}
