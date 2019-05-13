import { NgModule, ModuleWithProviders, SkipSelf, Optional } from '@angular/core';
import { Configuration } from './configuration';
import { HttpClient } from '@angular/common/http';


import { AccountControllerService } from './api/accountController.service';
import { ApprovalControllerService } from './api/approvalController.service';
import { BasicErrorControllerService } from './api/basicErrorController.service';
import { BulkUploadControllerService } from './api/bulkUploadController.service';
import { ClientWorkflowControllerService } from './api/clientWorkflowController.service';
import { ExportControllerService } from './api/exportController.service';
import { ListOfAccountsControllerService } from './api/listOfAccountsController.service';
import { PolicyTreeControllerService } from './api/policyTreeController.service';
import { PolicyTreeDesignControllerService } from './api/policyTreeDesignController.service';
import { SecurityControllerService } from './api/securityController.service';
import { TestControllerService } from './api/testController.service';

@NgModule({
  imports:      [],
  declarations: [],
  exports:      [],
  providers: [
    AccountControllerService,
    ApprovalControllerService,
    BasicErrorControllerService,
    BulkUploadControllerService,
    ClientWorkflowControllerService,
    ExportControllerService,
    ListOfAccountsControllerService,
    PolicyTreeControllerService,
    PolicyTreeDesignControllerService,
    SecurityControllerService,
    TestControllerService ]
})
export class ApiModule {
    public static forRoot(configurationFactory: () => Configuration): ModuleWithProviders {
        return {
            ngModule: ApiModule,
            providers: [ { provide: Configuration, useFactory: configurationFactory } ]
        };
    }

    constructor( @Optional() @SkipSelf() parentModule: ApiModule,
                 @Optional() http: HttpClient) {
        if (parentModule) {
            throw new Error('ApiModule is already loaded. Import in your base AppModule only.');
        }
        if (!http) {
            throw new Error('You need to import the HttpClientModule in your AppModule! \n' +
            'See also https://github.com/angular/angular/issues/20575');
        }
    }
}
