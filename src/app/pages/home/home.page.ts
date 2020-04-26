import { Component, OnInit } from '@angular/core';
import { Validators, FormGroup, FormBuilder } from "@angular/forms";
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Movimiento } from '../../models/movimiento';
import { LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  nisForm: FormGroup;
  private movimientosCollection: AngularFirestoreCollection<Movimiento>;
  movimientos: Observable<Movimiento[]>;
  nisActual: Movimiento;
  respuesta: string;
  hasRespuesta: boolean;

  constructor(public formBuilder: FormBuilder,
    private db: AngularFirestore,
    public loadingController: LoadingController) {
  }

  ngOnInit() {
    this.nisForm = this.formBuilder.group({
      nis: ['', [Validators.required]],
    })
    this.hasRespuesta = false;
  }

  buscar() {
    this.presentLoading();
    this.respuesta = "";
    this.nisActual = undefined;
    this.hasRespuesta = false;
    if (!this.nisForm.valid) {
      return false;
    } else {
      this.movimientosCollection = this.db.collection<Movimiento>('movimientos', ref =>
        ref.where('nis', '==', this.nisForm.value.nis));
      this.movimientos = this.movimientosCollection.valueChanges();
      this.movimientos.subscribe(d => {
        d.forEach(doc => {
          this.nisActual = doc;
        });
        this.hasRespuesta = true;
        if (this.nisActual == undefined) {
          this.respuesta = "NIS no ecnontrado";
        } else {
          if (this.nisActual.categoria.includes('BT')) {
            if (this.nisActual.consumo > 500) {
              this.respuesta = "NIS no exonerado por tener un consumo de " + this.nisActual.consumo.toString() + " kWh"
            } else {
              this.respuesta = "NIS exonerado por ser cliente en Baja Tension y tener un consumo de " + this.nisActual.consumo.toString() + " kWh"
            }
          } else {
            this.respuesta = "NIS no exonerado por no ser cliente en Baja Tension";
          }
        }
        this.dismissLoading();
      });
    }
    this.dismissLoading();
  }

  async presentLoading() {
    const loading = await this.loadingController.create({
      message: 'Buscando...',
    });
    await loading.present();
  }

  async dismissLoading() {
    const loading = await this.loadingController.dismiss();
  }
}