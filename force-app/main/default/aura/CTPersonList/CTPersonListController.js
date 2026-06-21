({
    doInit: function (component, event, helper) {

        component.set("v.columns", [
            {
                label: 'Name', fieldName: 'recordUrl', type: 'url', typeAttributes: {
                    label: { fieldName: 'Name__c' },
                    target: '_self'
                }
            },
            { label: 'Phone', fieldName: 'Phone__c', type: 'phone' },
            { label: 'Token', fieldName: 'Token__c', type: 'text' },
            { label: 'Status', fieldName: 'Status__c', type: 'text' },
            { label: 'Status Update Date', fieldName: 'Status_Update_Date__c', type: 'date' },
            {
                label: 'View', type: 'button', typeAttributes: {
                    label: 'View/Update',
                    name: 'view_details',
                    title: 'View Details',
                    variant: 'neutral'
                }
            }

        ]);

        var action = component.get("c.getContactData");
        action.setCallback(this, function (response) {
            var state = response.getState();
            if (state === "SUCCESS") {
                var records = response.getReturnValue();
                var updatedRecords = records.map(function (record) {
                    record.recordUrl = '/lightning/r/Contact/' + record.Id + '/view'; // Agar object Person__c hai toh Contact ki jagah uska API name likhein
                    return record;
                });

                component.set("v.data", updatedRecords);
            }
        });
        $A.enqueueAction(action);
    },
    handleRowAction: function (component, event, helper) {
        var action = event.getParam('action');
        var row = event.getParam('row');

        if (action.name === 'view_details') {
            var appEvent = $A.get("e.c:CTPersonSelectedEvent");
            appEvent.setParams({
                "selectedRecord": row
            });
            appEvent.fire();
        }
    },
    handleStatusUpdateToRed: function (component, event, helper) {
        var action = component.get("c.getContactData");
        action.setCallback(this, function (response) {
            if (response.getState() === "SUCCESS") {
                component.set("v.data", response.getReturnValue());
            }
        });
        $A.enqueueAction(action);
    }

})