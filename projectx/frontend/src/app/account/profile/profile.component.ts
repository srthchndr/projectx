import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { AccountServiceHandler } from 'src/shared/service-handler/service-handler';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  data: Observable<Object>;
  constructor(private accountServiceHandler: AccountServiceHandler,) { }

  ngOnInit(): void {
    this.accountServiceHandler.getProfile().subscribe((data: any) => {
      console.log(data);
      this.data = data;
    });
    console.log()
  }

}
