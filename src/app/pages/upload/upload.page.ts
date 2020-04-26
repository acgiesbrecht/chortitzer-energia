import { Component, OnInit } from '@angular/core';
import { Papa } from 'ngx-papaparse';
import { AngularFirestore, AngularFirestoreCollection, QuerySnapshot } from '@angular/fire/firestore';
import { Movimiento } from 'src/app/models/movimiento';
import { Observable } from 'rxjs';


@Component({
  selector: 'app-upload',
  templateUrl: './upload.page.html',
  styleUrls: ['./upload.page.scss'],
})
export class UploadPage implements OnInit {
  file: File;
  csvData: any[] = [];
  headerRow: any[] = [];
  private movimientosCollection: AngularFirestoreCollection<Movimiento>;
  movimientos: Observable<Movimiento[]>;
  constructor(private papa: Papa,
    private db: AngularFirestore) { }

  ngOnInit() {
  }

  changeListener($event): void {
    this.file = $event.target.files[0];

    var reader = new FileReader();
    reader.onload = () => {
      this.extractData(reader.result);
      this.movimientosCollection = this.db.collection<Movimiento>('movimientos');
      /*let batch = this.db.collection<Movimiento>('movimientos').ref.firestore.batch();
      this.movimientosCollection.get().forEach(e => {
        e.docs.forEach(doc => {
          batch.delete(doc.ref);
        });
        batch.commit();
      });*/

      for (let item of this.csvData) {
        if (item[0] != undefined && item[1] != undefined && item[2] != undefined && item[3] != undefined) {
          let mov = <Movimiento>{
            nis: item[0],
            categoria: item[1],
            consumo: item[2],
            mes: item[3]
          };
          this.movimientosCollection.add(mov);
        } else {
          console.log(item);
        }
      }
    };
    reader.readAsText(this.file);

  }

  private extractData(res) {
    let csvData = res || '';

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
