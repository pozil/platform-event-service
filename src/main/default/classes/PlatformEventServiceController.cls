public abstract class PlatformEventServiceController {
    @AuraEnabled
    public static String getSessionId() {
        return UserInfo.getSessionId();
    }

    @AuraEnabled
    public static void publish(String eventName, String data) {
        // Load event type
        Type platformEventType = Type.forName(eventName);
        if (platformEventType == null) {
            throw new AuraHandledException('Unknown platform event type: '+ eventName);
        }
        // Create event instance
        SObject event;
        try {
            event = (SObject) JSON.deserialize(data, platformEventType);
        } catch (Exception e) {
            throw new AuraHandledException('Failed to instantiate '+ eventName +' platform event with provided data: '+ data);
        }
        // Publish event
        Database.SaveResult result = Eventbus.publish(event);
        if (!result.isSuccess()) {
            String errorMessage = 'Failed to publish '+ eventName +': EventBus publish error.';
            System.debug(errorMessage);
            for(Database.Error error : result.getErrors()) {
                System.debug('Error: ' + error.getStatusCode() +' - '+ error.getMessage() +' - '+ error.getFields());
            }
            throw new AuraHandledException(errorMessage);
        }
    }
}
