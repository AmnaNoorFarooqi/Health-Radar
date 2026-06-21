({

    handlePersonSelected: function (component, event, helper) {
        var recordFromEvent = event.getParam("selectedRecord");
        component.set("v.selectedRecord", recordFromEvent);
    },
    updateStatusToRed: function (component, event, helper) {
        const appEvent = $A.get("e.c:CTUpdateStatusToRedEvent");
        var selectedRec = component.get("v.selectedRecord");

        // Apex call setup
        var action = component.get("c.updateRecordStatus");
        action.setParams({
            "recordId": selectedRec.Id
        });

        action.setCallback(this, function (response) {
            var state = response.getState();
            if (state === "SUCCESS") {
                alert("Status Successfully Updated to Red!");
                var refreshEvent = $A.get("e.c:CTUpdateStatusToRedEvent");
                refreshEvent.fire();
                // 2. Right side panel ko khali (hide) kar dein
                component.set("v.selectedRecord", null);
            } else {
                var errors = response.getError();
                if (errors && errors[0] && errors[0].message) {
                    alert("Salesforce Backend Error: " + errors[0].message);
                } else {
                    alert("Unknown error occured or DML failed!");
                }
            }
        });
        $A.enqueueAction(action);
    }
})