import { Component, OnInit } from '@angular/core';
import { Validators, FormGroup, FormBuilder } from "@angular/forms";
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Movimiento } from '../../models/movimiento';
import { LoadingController } from '@ionic/angular';
import { Papa } from 'ngx-papaparse';
import { Http, Response } from '@angular/http';

export interface MovimientoExoneracion {
  movimiento: Movimiento,
  exonerado: string,
  color: string
}

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  nisForm: FormGroup;
  private movimientosCollection: AngularFirestoreCollection<Movimiento>;
  movimientos: Movimiento[];
  csvData: any[] = [];
  headerRow: any[] = [];
  nisActual: Movimiento;
  respuestaMovimiento: MovimientoExoneracion;
  hasRespuesta: boolean;
  notFound: boolean;
  notValid: boolean;

  constructor(public formBuilder: FormBuilder,
    private db: AngularFirestore,
    public loadingController: LoadingController,
    private papa: Papa,
    private http: Http) {
  }

  ngOnInit() {
    this.nisForm = this.formBuilder.group({
      nis: ['', [Validators.required]],
    })
    this.hasRespuesta = false;
    this.http.get('../../assets/movs-abril-exoneracion.csv')
      .subscribe(
        data => this.extractData(data),
        err => console.log(err)
      );
  }

  buscar() {
    this.notValid = false;
    this.respuestaMovimiento = undefined;
    this.nisActual = undefined;
    this.hasRespuesta = false;
    this.notFound = false;
    if (!this.nisForm.valid) {
      this.notValid = true;
    } else {
      //this.presentLoading();
      let nis: string = this.nisForm.value.nis;
      if (nis.length == 8) {
        nis = nis.substr(0, 4) + "-" + nis.substr(4, 4);
        this.nisForm.value.nis = nis;
      }

      for (let item of this.csvData) {
        if (item[0] != undefined && item[1] != undefined && item[2] != undefined && item[3] != undefined) {
          if (item[0] == this.nisForm.value.nis) {
            this.nisActual = <Movimiento>{
              nis: item[0],
              categoria: item[1],
              consumo: item[2],
              mes: item[3]
            };
          }
        }
      }

      /*this.movimientosCollection = this.db.collection<Movimiento>('movimientos', ref =>
        ref.where('nis', '==', this.nisForm.value.nis));
      this.movimientos = this.movimientosCollection.valueChanges();
      this.movimientos.subscribe(d => {
        d.forEach(doc => {
          this.nisActual = doc;
        });*/
      if (this.nisActual == undefined) {
        this.notFound = true;
      } else {
        this.hasRespuesta = true;
        if (this.nisActual.categoria.includes('BT')) {
          if (this.nisActual.consumo > 500) {
            this.respuestaMovimiento = <MovimientoExoneracion>{
              movimiento: this.nisActual,
              color: "danger",
              exonerado: "NO"
            };
          } else {
            this.respuestaMovimiento = <MovimientoExoneracion>{
              movimiento: this.nisActual,
              color: "success",
              exonerado: "SI"
            };
          }
        } else {
          this.respuestaMovimiento = <MovimientoExoneracion>{
            movimiento: this.nisActual,
            color: "danger",
            exonerado: "NO"
          };
        }
      }
      //this.dismissLoading();
    }
    //this.dismissLoading();
  }

  private async presentLoading() {
    const loading = await this.loadingController.create({
      message: 'Buscando...',
    });
    await loading.present();
  }

  private async dismissLoading() {
    const loading = await this.loadingController.dismiss();
  }

  private extractData(res) {
    let csvData = res['_body'] || '';

    this.papa.parse(csvData, {
      complete: parsedData => {
        this.headerRow = parsedData.data.splice(0, 1)[0];
        this.csvData = parsedData.data;
      },
      dynamicTyping: true
    });

    //console.log(this.csvData);
  }
}