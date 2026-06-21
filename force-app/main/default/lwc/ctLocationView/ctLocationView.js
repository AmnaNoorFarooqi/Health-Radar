import { LightningElement, wire, api } from 'lwc';
import getLocations from '@salesforce/apex/LocationController.getLocations';
import sanitizeLocationRecord from '@salesforce/apex/LocationController.sanitizeLocationRecord';
import { refreshApex } from '@salesforce/apex';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
export default class CtLocationView extends LightningElement {
    data = [];
    searchKey = ''; 
    wiredResult;
    columns = [
        { 
            label: 'Location Name', 
            fieldName: 'recordUrl', 
            type: 'url',
            typeAttributes: {
                label: { fieldName: 'Name' },
                target: '_self'
            }
        },
        { label: 'Area Pin Code', fieldName: 'Pin_Code__c', type: 'text' },
        { label: 'Risk Level', fieldName: 'Risk_Level__c', type: 'text' },
        { label: 'Total Red Visitors', fieldName: 'Total_Red_Visitors__c', type: 'number' },
        { label: 'Max Capacity', fieldName: 'Max_Capacity__c', type: 'number' },
        { 
            label: 'Last Sanitized', 
            fieldName: 'Last_Sanitized_Date__c', 
            type: 'date',
            typeAttributes: {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                hour12: true
            }
        },
        {
            label: 'Actions',
            type: 'button',
            typeAttributes: {
                label: 'Mark Sanitized',
                name: 'sanitize', 
                title: 'Click to sanitize',
                variant: 'brand'
            }
        }
    ];

    // Is @wire function ko variables ke neeche add karein
    @wire(getLocations, { searchKey: '$searchKey' })
    wiredLocations(result) {
        this.wiredResult = result; // refreshApex ke liye zaroori hai
        if (result.data) {
            // URL mapping taake Location Name par click ho sake
            this.data = result.data.map(record => {
                return {
                    ...record,
                    recordUrl: `/lightning/r/Location__c/${record.Id}/view`
                };
            });
        } else if (result.error) {
            console.error('Error fetching locations:', result.error);
            this.data = [];
        }
    }
    handleRowAction(event) {
        const actionName = event.detail.action.name; // 'sanitize' milega yahan
        const row = event.detail.row;                // Clicked row ka data

        if (actionName === 'sanitize') {
            this.handleSanitize(row.Id);
        }
    }

    // Actual Logic jo Apex ko data bhejegi aur refresh karegi
    handleSanitize(locationId) {
        sanitizeLocationRecord({ locId: locationId })
            .then(() => {
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Success',
                        message: 'Location status updated to Green and DateTime recorded!',
                        variant: 'success'
                    })
                );
                // Table ko refresh karega taake nayi datetime live dikhe
                return refreshApex(this.wiredResult);
            })
            .catch(error => {
                console.error('Error in sanitizing:', error);
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Error',
                        message: error.body.message,
                        variant: 'error'
                    })
                );
            });
    }

    @api
    refreshTable() {
        return refreshApex(this.wiredResult);
    }
}