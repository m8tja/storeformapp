import { Component, OnInit } from '@angular/core';
import { DatePipe, formatDate, NgFor } from '@angular/common';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Store } from '../store.model';
import { NgForm } from '@angular/forms';
import { Obrazec } from '../obrazec.model';

@Component({
  selector: 'app-form-component',
  templateUrl: './form-component.component.html',
  styleUrls: ['./form-component.component.css']
})
export class FormComponentComponent implements OnInit{
  
  today = formatDate(new Date(), "dd/MM/yyyy", "en");
  store: Store = new Store();
  selected: string;
  selectedAddress: string = "";
  selectedPhone: string = "";
  storeArray: Array<Store> = [];

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    
    this.loadData();
    
  }

  loadData() {
    this.http.get<any>("http://localhost:8080/getStore").subscribe({
      next: (data) => {
        data.forEach((element: any) => {
          this.store.name = element.name;
          this.store.address = element.address;
          this.store.phone = element.phone;
          this.storeArray.push(this.store);
          this.store = new Store();
        });
      },
      error: (e: HttpErrorResponse) => alert(e.message),
      complete: () => console.info('Data received.') 
    })
  }

  onSelectChange() {
    const selectedChange = this.storeArray.find(store => store.name === this.selected);
    this.selectedAddress = selectedChange?.address!;
    this.selectedPhone = selectedChange?.phone!;
  }

  onSubmit(form: NgForm) {
    form.value.payment_installments = +form.value.payment_installments;

    this.http.post<Obrazec>("http://localhost:8080/add", form.value).subscribe({
        next: (v) => console.log(v),
        error: (e: HttpErrorResponse) => alert(e.message),
        complete: () => console.info('Form sent.') 
    })

    this.resetForm(form);
  }

  onReset(form: NgForm) {
    this.resetForm(form);
    console.log("Form reset.")
  }

  resetForm(form: NgForm) {
    form.resetForm({
      date: this.today
    });
    this.selected = "";
    this.selectedAddress = "";
    this.selectedPhone = "";
  }

}