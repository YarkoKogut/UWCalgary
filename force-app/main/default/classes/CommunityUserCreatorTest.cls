@IsTest
private class CommunityUserCreatorTest {

    @TestSetup
    static void setup() {
        // Create a test Account and Contact
        Account acc = new Account(Name = 'Test Household');
        insert acc;

        Contact con = new Contact(
            FirstName  = 'Jane',
            LastName   = 'Demo',
            Email      = 'jane.demo@example-test.com',
            AccountId  = acc.Id
        );
        insert con;
    }

    @IsTest
    static void testCreateUserSuccess() {
        Contact con = [SELECT Id FROM Contact WHERE LastName = 'Demo' LIMIT 1];

        CommunityUserCreator.CreateUserInput inp = new CommunityUserCreator.CreateUserInput();
        inp.firstName = 'Jane';
        inp.lastName  = 'Demo';
        inp.email     = 'jane.demo@example-test.com';
        inp.contactId = con.Id;

        Test.startTest();
        List<CommunityUserCreator.CreateUserOutput> results =
            CommunityUserCreator.createUser(new List<CommunityUserCreator.CreateUserInput>{ inp });
        Test.stopTest();

        System.assertEquals(1, results.size(), 'Should return one result');
        System.assertNotEquals(null, results[0].userId, 'User Id should be set');
        System.assertEquals(null, results[0].errorMessage, 'No error expected');
    }

    @IsTest
    static void testCreateUserMissingContact() {
        CommunityUserCreator.CreateUserInput inp = new CommunityUserCreator.CreateUserInput();
        inp.firstName = 'Ghost';
        inp.lastName  = 'User';
        inp.email     = 'ghost@example-test.com';
        inp.contactId = 'invalidId000000000'; // bad ID — should throw

        Test.startTest();
        List<CommunityUserCreator.CreateUserOutput> results =
            CommunityUserCreator.createUser(new List<CommunityUserCreator.CreateUserInput>{ inp });
        Test.stopTest();

        System.assertEquals(1, results.size());
        System.assertNotEquals(null, results[0].errorMessage, 'Error message should be set');
    }
}
