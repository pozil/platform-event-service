({
    onInit : function(component, event, helper) {
        component.set('v.pubEventData', '{\n  \"Message__c\": \"Hello world!\"\n}');
        
        const pes = component.find('peService');
        pes.subscribe('Sample__e');
    },

    onPublish : function(component, event, helper) {
        const pes = component.find('peService');
        const eventName = component.get('v.pubEventName');
        const eventData = JSON.parse(component.get('v.pubEventData'));
        pes.publish(eventName, eventData, errors => {
            if (errors) {
                // Optional error handler here (already covered by call to server)
            } else {
                helper.showToast(component, 'Success', 'Published platform event: '+ eventName, 'success', 'pester');
            }
        });
    },

    onSubscribe : function(component, event, helper) {
        const pes = component.find('peService');
        const eventName = component.get('v.subEventName');
        pes.subscribe(eventName, isSuccess => {
            if (isSuccess) {
                helper.showToast(component, 'Success', 'Subscribed to platform event: '+ eventName, 'success', 'pester');
            } else {
                helper.showToast(component, 'Error', 'Failed to subscribe to platform event: '+ eventName, 'error', 'sticky');
            }
        });
    },

    onIncomingEvent : function(component, event, helper) {
        const eventName = event.getParam('eventName');
        const eventData = event.getParam('data');
        let eventList = component.get('v.subEventData');
        eventList = eventName +'\n'+ JSON.stringify(eventData) +'\n\n'+ eventList;
        component.set('v.subEventData', eventList);
        helper.showToast(component, 'Incoming Event', 'Received platform event: '+ eventName, 'info', 'pester');
    }
})
