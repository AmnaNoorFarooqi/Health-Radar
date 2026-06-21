public with sharing class LocationController {
    @AuraEnabled(cacheable=true)
    public static List<Location__c> getLocations(String searchKey) {
        String key = '%' + searchKey + '%';
        return [SELECT Name, Pin_Code__c, Risk_Level__c, Total_Red_Visitors__c, Max_Capacity__c, Last_Sanitized_Date__c FROM Location__c ];
    }
    @AuraEnabled
    public static void sanitizeLocationRecord(String locId) {
        try {
            Location__c loc = new Location__c(Id = locId);
            
            loc.Risk_Level__c = 'Green';                  
            loc.Last_Sanitized_Date__c = System.now();    
            update loc;
        } catch(Exception e) {
            throw new AuraHandledException('Sanitization Error: ' + e.getMessage());
        }
    }
}