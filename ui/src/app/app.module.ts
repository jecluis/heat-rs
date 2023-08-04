import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { WindowTitlebarComponent } from "./layout/window-titlebar/window-titlebar.component";
import { MainLayoutComponent } from "./layout/main-layout/main-layout.component";
import { LogButtonComponent } from "./components/log/log-button/log-button.component";
import { LogWeightModalComponent } from "./components/log/log-weight-modal/log-weight-modal.component";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { GlobalToasterComponent } from "./shared/components/global-toaster/global-toaster.component";

@NgModule({
  declarations: [
    AppComponent,
    WindowTitlebarComponent,
    MainLayoutComponent,
    LogButtonComponent,
    LogWeightModalComponent,
    GlobalToasterComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgbModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
