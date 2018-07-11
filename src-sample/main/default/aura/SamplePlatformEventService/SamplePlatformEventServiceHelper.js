({
    showToast : function(component, title, message, type, mode) {
        const toastEvent = $A.get("e.force:showToast");
        if (typeof toastEvent !== 'undefined') {
            toastEvent.setParams({title, message, type, mode});
            toastEvent.fire();
        }
        else {
            alert(title +'\n'+ message);
        }
    }
})
