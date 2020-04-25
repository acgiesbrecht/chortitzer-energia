import { Component, OnInit } from '@angular/core';
import { Validators, FormGroup, FormBuilder } from "@angular/forms";
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

export interface Consumo {
  nis: string,
  consumo: number,
  mes: number;
}

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  nisForm: FormGroup;
  private consumosCollection: AngularFirestoreCollection<Consumo>;
  consumos: Observable<Consumo[]>;
  consumoNis: number;
  respuesta: string;
  hasRespuesta: boolean;

  constructor(public formBuilder: FormBuilder,
    private db: AngularFirestore) {
  }

  ngOnInit() {
    this.nisForm = this.formBuilder.group({
      nis: ['', [Validators.required]],
    })
    this.hasRespuesta = false;
  }

  buscar() {
    this.respuesta = "";
    this.consumoNis = undefined;
    this.hasRespuesta = false;
    if (!this.nisForm.valid) {
      return false;
    } else {
      this.consumosCollection = this.db.collection<Consumo>('consumos', ref => ref.where('nis', '==', this.nisForm.value.nis));
      this.consumos = this.consumosCollection.valueChanges();
      this.consumos.subscribe(d => {
        d.forEach(doc => {
          this.consumoNis = doc.consumo;
        });
        this.hasRespuesta = true;
        if (this.consumoNis == undefined) {
          this.respuesta = "NIS no ecnontrado";
        } else {
          if (this.consumoNis > 500) {
            this.respuesta = "NIS no exonerado por tener un consumo de " + this.consumoNis.toString() + " kWh"
          } else {
            this.respuesta = "NIS exonerado por tener un consumo de " + this.consumoNis.toString() + " kWh"
          }
        }
      });

    }
  }
}