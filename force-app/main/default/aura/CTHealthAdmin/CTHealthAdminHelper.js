({
getLiveCounts: function (component, event, helper) {
        var action = component.get("c.getStatusCounts");
        
        action.setCallback(this, function (response) {
            var state = response.getState();
            if (state === "SUCCESS") {
                var counts = response.getReturnValue();
                
                if (counts) {
                    // Safe Check: Agar Apex se Capital keys aayin ya Lowercase, dono handle ho jayengi
                    component.set("v.Green", counts.Green || counts.green || 0);
                    component.set("v.Yellow", counts.Yellow || counts.yellow || 0);
                    component.set("v.Orange", counts.Orange || counts.orange || 0);
                    component.set("v.Red", counts.Red || counts.red || 0);
                }
            } else {
                console.error("Failed to fetch status counts: " + JSON.stringify(response.getError()));
            }
        });
        $A.enqueueAction(action);
    }
})