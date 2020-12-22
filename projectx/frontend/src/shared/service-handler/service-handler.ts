import { HttpClient } from "@angular/common/http";
import { Inject, Injectable } from "@angular/core";
import { map } from "rxjs/operators";
import { AppConstant } from "src/app/shared/constants/app.constant";

@Injectable()
export class AccountServiceHandler {

    private httpClient: HttpClient = null;

    constructor(@Inject(HttpClient) httpClient: HttpClient) {
        this.httpClient = httpClient;
    }

    public getProfile() {
        return this.httpClient.get<any>(`${AppConstant.apiBaseURL}/testdata`)
          .pipe(map((response: any) => { return response}));
      }
}