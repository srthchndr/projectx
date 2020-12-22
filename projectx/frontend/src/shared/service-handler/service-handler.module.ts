import { NgModule } from '@angular/core';
import * as APIServiceHandlers from './service-handler';

@NgModule({
    providers: [
        APIServiceHandlers.AccountServiceHandler
    ]
})

export class ServiceHandlerModule {

}