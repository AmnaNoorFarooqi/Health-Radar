public with sharing class CTPersonController {
    @AuraEnabled
    public static List<Health_Admin_View__c> getContactData() {
        return [SELECT Id, Name__c, Phone__c, Token__c , Status__c , Status_Update_Date__c FROM Health_Admin_View__c LIMIT 50];
    }
    @AuraEnabled
    public static void updateRecordStatus(String recordId) {
        try {
            // 1. Record instantiate karein
            Health_Admin_View__c person = new Health_Admin_View__c(Id = recordId);
            // 2. Fields set karein
            person.Status__c = 'Red';
            person.Status_Update_Date__c = Date.today();
            // 3. Database update command
            update person;
        } catch(Exception e) {
            // Agar validation rule ya filter check roke, toh custom error throw karein
            throw new AuraHandledException('Apex Error: ' + e.getMessage());
        }
    }
    @AuraEnabled
    public static Map<String, Integer> getStatusCounts() {
        Map<String, Integer> statusCounts = new Map<String, Integer>{
            'Green' => 0,
            'Yellow' => 0,
            'Orange' => 0,
            'Red' => 0};
        List<AggregateResult> results = [SELECT Status__c, COUNT(Id) total FROM Health_Admin_View__c GROUP BY Status__c];
        for (AggregateResult ar : results) {
            String status = (String) ar.get('Status__c');
            Integer count = Integer.valueOf(ar.get('total'));
            if (status != null && statusCounts.containsKey(status)) {
                statusCounts.put(status, count);
            }
        }
        return statusCounts;
    }
}