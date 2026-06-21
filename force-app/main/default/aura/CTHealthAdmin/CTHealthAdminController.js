({
    doInit: function (component, event, helper) {
        helper.getLiveCounts(component);
    },
    handleRefresh: function (component, event, helper) {
        // Yeh line seedha helper ke paas bhej degi kaam ko
        helper.getLiveCounts(component);
    },

    clickNew: function (component, event, helper) {
        var createRecordEvent = $A.get("e.force:createRecord");
        if (createRecordEvent) {
            createRecordEvent.setParams({
                "entityApiName": "Health_Admin_View__c"
            });
            createRecordEvent.fire();
        } else {
            alert("Record create karne ka event is context mein available nahi hai.");
        }
    },

    // Is naye function ko apne Aura controller mein add karein
    handleLocationAdded : function(component, event, helper) {
        // aura:id ke zariye LWC datatable ko dhoonda
        var datatableComponent = component.find("locationDatatable");
        
        if (datatableComponent) {
            // LWC ke andar maujood @api method ko directly call kar diya
            datatableComponent.refreshTable();
        }
    }

})