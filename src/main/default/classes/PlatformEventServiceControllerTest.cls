@isTest
public class PlatformEventServiceControllerTest {
    static testMethod void getSessionId_should_work() {
        String sessionId = PlatformEventServiceController.getSessionId();
        System.assert(sessionId != null);
    }

    static testMethod void publish_should_fail_when_invalid_eventName() {
        try {
            PlatformEventServiceController.publish('unknown', null);
            System.assert(false, 'Exception was expected');
        } catch (Exception e) {
            System.assert(e instanceof AuraHandledException);
        }
    }
}
