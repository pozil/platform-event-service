({
    onInit : function(component, event, helper) {
        // Disconnect CometD when leaving page
        window.addEventListener('unload', $A.getCallback(event => {
            helper.disconnectCometd(component);
        }));
        // Get session Id
        const server = component.find('server');
        const serverAction = component.get('c.getSessionId');
        server.callServer(serverAction, {}, false, sessionId => {
            component.set('v.sessionId', sessionId);
            if (component.get('v.cometd') != null) {
                helper.connectCometd(component);
            }
        });
    },

    onCometdScriptLoaded : function(component, event, helper) {
        const cometd = new org.cometd.CometD();
        component.set('v.cometd', cometd);
        if (component.get('v.sessionId') != null) {
            helper.connectCometd(component);
        }
    },

    onPublishEvent : function(component, event, helper) {
        const params = {
            eventName: event.getParam('eventName'),
            data: JSON.stringify(event.getParam('data')),
        }
        helper.publishPlatformEvent(component, params);
    },

    onPublishMethod : function(component, event, helper) {
        const params = event.getParam('arguments');
        params.data = JSON.stringify(params.data);
        helper.publishPlatformEvent(component, params, params.callback);
    },

    onSubscribeEvent : function(component, event, helper) {
        const eventName = event.getParam('eventName');
        helper.subscribePlatformEvent(component, eventName);
    },

    onSubscribeMethod : function(component, event, helper) {
        const params = event.getParam('arguments');
        helper.subscribePlatformEvent(component, params.eventName, params.callback);
    },

    onLocationChange : function(component, event, helper) {
        helper.disconnectCometd(component);
    }
})