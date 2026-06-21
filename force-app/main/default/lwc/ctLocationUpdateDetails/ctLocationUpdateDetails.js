import { LightningElement } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
export default class LocationForm extends LightningElement {

    handleSuccess(event) {
        const recordId = event.detail.id;
        const toastEvent = new ShowToastEvent({
            title: 'Success!',
            message: 'Nayi Location successfully register ho gayi hai! ID: ' + recordId,
            variant: 'success',
        });

        this.dispatchEvent(toastEvent);

        // 2. Form ko khali (reset) karne ke liye taake admin dusri location add kar sake
        const inputFields = this.template.querySelectorAll('lightning-input-field');
        if (inputFields) {
            inputFields.forEach(field => {
                if (field.fieldName === 'Risk_Level__c') {
                    field.value = 'Green';
                } else {
                    field.value = '';
                }
            });
        }

        // 3. Left side wali Datatable ko batane ke liye ke naya data aa gaya hai
        // Hum ek Custom Event fire karenge jo dono components ka 'Parent' sunega
        
        const refreshEvent = new CustomEvent('locationadded');
        this.dispatchEvent(refreshEvent);
    }
    // handleLocationCreated() {
    //     // querySelector se hum left wali table component ko target kar rahe hain
    //     const tableCmp = this.template.querySelector('.table-component');

    //     if (tableCmp) {
    //         // Table ke andar jo @api refreshTable() method banaya tha, usko call kar rahe hain
    //         tableCmp.refreshTable();
    //     }
    // }
    // // ctLocationView.js ke andar check karein
    // handleRowAction(event) {
    //     const actionName = event.detail.action.name;
    //     const row = event.detail.row; 

    //     if (actionName === 'sanitize') {
    //         if (row.Id) {
    //             this.handleSanitize(row.Id);
    //         } else {
    //             console.error('Record Id nahi mili datatable se!');
    //         }
    //     }
    // }

    handleSanitize(locationId) {
        sanitizeLocationRecord({ locId: locationId })
            .then(() => {
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Success',
                        message: 'Location sanitize ho gayi!',
                        variant: 'success'
                    })
                );
                return refreshApex(this.wiredResult);
            })
            .catch(error => {
                console.error('Apex Update Error:', error);
            });
    }

}