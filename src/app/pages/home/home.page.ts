import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  nisForm: FormGroup;

  constructor() { }

  ngOnInit() {
  }

  formSubmit() {
    if (!this.nisForm.valid) {
      return false;
    } else {
      /* this.nisService.createNis(this.nisForm.value).then(res => { })
         .catch(error => console.log(error));
       this.nisForm.reset();
       this.router.navigate(['/home']);*/
    }
  }

}
