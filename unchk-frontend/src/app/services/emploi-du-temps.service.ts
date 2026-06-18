import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface CoursItem {
  id: number;
  jour: string;
  heure: string;
  cours: string;
  salle: string;
  color: string;
  formation: string;
  niveau: string;
  semaine: string;
}

@Injectable({ providedIn: 'root' })
export class EmploiDuTempsService {

  private api = 'http://localhost:8080/api/emploi-du-temps';

  constructor(private http: HttpClient) {}

  getBySemaine(semaine: string): Observable<CoursItem[]> {
    return this.http.get<CoursItem[]>(`${this.api}/semaine/${semaine}`);
  }

  getAll(): Observable<CoursItem[]> {
    return this.http.get<CoursItem[]>(this.api);
  }
}
