import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

import { CoreModule } from '@dashboard/app/core';
import { SearchComponent } from '@customers/app/customers/views/search/search.view';
import { SearchBarComponent } from './views/search/search-bar/search-bar.component';
import { CustomerCardComponent } from './views/search/customer-card/customer-card.component';
import { ProfileComponent } from '@customers/app/customers/views/profile/profile.view';
import { OperationsComponent } from '@customers/app/customers/views/operations/operations.view';
import { RouterModule } from '@angular/router';
import { ProfileCardComponent } from '@customers/app/customers/views/profile/profile-card/profile-card.component';
import { PaymentsCardComponent } from './views/profile/payments/payments-card.component';
import { StepsComponent } from './views/operations/steps/steps.component';
import { SidebarComponent } from './views/operations/sidebar/sidebar.component';
import { CustomerCardInfoComponent } from '@customers/app/customers/views/search/customer-card/customer-card-info/customer-card-info.component';
import { CustomerSidebarInfoComponent } from '@customers/app/customers/views/operations/sidebar/customer-sidebar-info/customer-sidebar-info.component';
import { SelectOperationComponent } from './views/operations/steps/select-operation/select-operation.component';
import { RegisterComponent } from './views/register/register.view';
import { CustomerAddComponent } from './views/register/customer-add/customer-add.view';
import { PortabilityComponent } from './views/operations/steps/portability/portability.component';
import { SaleComponent } from './views/operations/steps/sale/sale.component';
import { SummaryComponent } from './views/operations/steps/summary/summary.component';
import { AddLineComponent } from './views/operations/steps/portability/add-line/add-line.component';
import { DocumentsSignComponent } from './views/operations/steps/documents-sign/documents-sign.component';
import { TradeAgreementsComponent } from './views/operations/steps/trade-agreements/trade-agreements.component';
import { ValidatePortabilityComponent } from './views/operations/steps/validate-portability/validate-portability.component';
import { SaleErrorComponent } from './views/operations/steps/sale-error/sale-error.component';
import { SuccessSaleComponent } from './views/success-sale/success-sale.view';
import { SaleSidebarInfoComponent } from './views/operations/sidebar/sale-info/sale-info.component';
import { PaymentDocumentationComponent } from './views/operations/steps/payment-documentation/payment-documentation.component';
import { DeclarationKnowledgeComponent } from './views/operations/steps/portability/declaration-knowledge/declaration-knowledge.component';
import { ReplacementComponent } from './views/operations/steps/replacement/replacement.component';
import { EntranceFormComponent } from './views/operations/steps/replacement/entrace-form/entrance-form.component';
import { RenewalComponent } from './views/operations/steps/renewal/renewal.component';
import { RenewEntranceFormComponent } from './views/operations/steps/renewal/renew-entrance-form/renew-entrance-form.component';
import { LoginComponent } from './views/operations/steps/login/login.component';
import { MultipointsComponent } from './views/operations/steps/multipoints/multipoints.component';
import { ReasonComponent } from './views/operations/steps/reason/reason.component';
import { SupervisorAuthComponent } from './views/operations/steps/supervisor-auth/supervisor-auth.component';
import { ClaroPointsComponent } from './views/operations/steps/claro-points/claro-points.component';
import { LoyaltyComponent } from './views/operations/steps/loyalty/loyalty.component';
import { MaxlinesComponent } from './views/operations/steps/maxlines/maxlines.component';
import { DeliveryComponent } from './views/operations/steps/delivery/delivery.component';
import { SummaryDeliveryComponent } from './views/operations/steps/summary-delivery/summary-delivery.component';
import { ClaroclubPrintComponent } from './views/operations/steps/claroclub-print/claroclub-print.component';
import { DispatchOptionsComponent } from './views/operations/steps/dispatch-options/dispatch-options.component';
import { NoBiometricPrintComponent } from './views/operations/steps/no-biometric-print/no-biometric-print.component';

@NgModule({
  declarations: [
    SearchComponent,
    ProfileComponent,
    OperationsComponent,
    SearchBarComponent,
    CustomerCardComponent,
    ProfileCardComponent,
    PaymentsCardComponent,
    StepsComponent,
    SidebarComponent,
    CustomerCardInfoComponent,
    CustomerSidebarInfoComponent,
    SelectOperationComponent,
    RegisterComponent,
    CustomerAddComponent,
    PortabilityComponent,
    AddLineComponent,
    SaleComponent,
    SummaryComponent,
    DocumentsSignComponent,
    TradeAgreementsComponent,
    ValidatePortabilityComponent,
    SaleErrorComponent,
    SuccessSaleComponent,
    SaleSidebarInfoComponent,
    PaymentDocumentationComponent,
    DeclarationKnowledgeComponent,
    ReplacementComponent,
    EntranceFormComponent,
    LoginComponent,
    RenewalComponent,
    RenewEntranceFormComponent,
    MultipointsComponent,
    ReasonComponent,
    SupervisorAuthComponent,
    ClaroPointsComponent,
    LoyaltyComponent,
    MaxlinesComponent,
    DeliveryComponent,
    SummaryDeliveryComponent,
    ClaroclubPrintComponent,
    DispatchOptionsComponent,
    NoBiometricPrintComponent,
  ],
  entryComponents: [
    DeclarationKnowledgeComponent,
    SupervisorAuthComponent,
    MaxlinesComponent,
  ],
  imports: [CoreModule, RouterModule, ReactiveFormsModule],
})
export class CustomersModule {}
