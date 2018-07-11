({
    connectCometd : function(component) {
        // Configure CometD
        const cometdUrl = window.location.protocol+'//'+window.location.hostname+'/cometd/43.0/';
        const cometd = component.get('v.cometd');
        cometd.configure({
            url: cometdUrl,
            requestHeaders: { Authorization: 'OAuth '+ component.get('v.sessionId')},
            appendMessageTypeToURL : false
        });
        cometd.websocketEnabled = false;
        
        // Establish CometD connection
        console.log('Connecting to CometD: '+ cometdUrl);
        cometd.handshake($A.getCallback(handshakeReply => {
            if (handshakeReply.successful) {
                console.log('Connected to CometD.');
                component.set('v.canSubscribe', true);
                // Subscribe to platform events
                cometd.batch($A.getCallback(() => {
                    // Get subscriptions from App Builder param
                    let events = this.getAppBuilderPlatformEvents(component);
                    // Get pending subscriptions
                    events = events.concat(component.get('v.subscriptionQueue'));
                    component.set('v.subscriptionQueue', []);
                    // Process susbcriptions
                    events.forEach(pe => {
                        this.subscribePlatformEvent(component, pe.eventName, pe.callback);
                    });
                }));
            }
            else {
                console.error('Failed to connected to CometD.');
            }
        }));
    },

    disconnectCometd : function(component) {
        const cometd = component.get('v.cometd');
        if (cometd === null)
            return;
        // Unsuscribe all CometD subscriptions
        cometd.batch($A.getCallback(() => {
            const subscriptions = component.get('v.subscriptions');
            subscriptions.forEach(subscription => {
                cometd.unsubscribe(subscription);
            });
        }));
        component.set('v.subscriptions', []);
        // Disconnect CometD
        cometd.disconnect();
        console.log('CometD disconnected.');
    },

    getAppBuilderPlatformEvents : function(component) {
        const rawEventNames = component.get('v.eventNames');
        if (typeof rawEventNames === 'undefined' || rawEventNames === '') {
            return [];
        }
        return rawEventNames.split(',').map(eventName => {
            return {eventName: eventName.trim(), callback: null};
        });
    },

    onPlatformEvent : function(component, platformEvent) {
        console.log('Receiving plaftorm event', JSON.stringify(platformEvent));
        let eventName = platformEvent.channel;
        eventName = eventName.substring(eventName.lastIndexOf('/')+1);
        const incomingEvent = $A.get('e.c:IncomingPlatformEvent');
        incomingEvent.setParams({
            eventName: eventName,
            data: platformEvent.data
        });
        incomingEvent.fire();
    },

    publishPlatformEvent : function(component, platformEvent, callback) {
        console.log('Publishing plaftorm event', JSON.stringify(platformEvent));
        const server = component.find('server');
        const serverAction = component.get('c.publish');
        server.callServer(serverAction, platformEvent, false,
            $A.getCallback(response => {
                if (callback) {
                    callback(null);
                }
            }),
            $A.getCallback(errors => {
                if (callback) {
                    callback(errors);
                }
            }));
    },

    subscribePlatformEvent : function(component, eventName, callback=null) {
        // Check if cometd is ready to subscribe to events
        if (!component.get('v.canSubscribe')) {
            console.log('Deferring subscription to platform event', eventName);
            const subQueue = component.get('v.subscriptionQueue');
            subQueue.push({eventName, callback});
            component.set('v.subscriptionQueue', subQueue);
            return;
        }
        // Prevent duplicate subscriptions
        const channel = '/event/'+ eventName;
        const subscriptions = component.get('v.subscriptions');
        const duplicate = subscriptions.filter(sub => sub.channel === channel);
        if (duplicate.length > 0) {
            console.warn('Already subscribed to platform event', eventName);
            if (callback) {
                callback(true); // Warn but consider this as a success
            }
            return;
        }
        // Subscribe to event
        const cometd = component.get('v.cometd');
        const newSubscription = cometd.subscribe(channel, $A.getCallback(platformEvent => {
            this.onPlatformEvent(component, platformEvent);
        }), subscribeReply => {
            console.log(subscribeReply.successful ? 'Subscribed to' : 'Failed to subscribe to', eventName);
            if (callback) {
                callback(subscribeReply.successful);
            }
        });
        // Save subscription for later
        subscriptions.push(newSubscription);
        component.set('v.subscriptions', subscriptions);
    }
})