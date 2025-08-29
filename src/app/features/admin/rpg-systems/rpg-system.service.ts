import { Injectable } from '@angular/core';
import { QueryParameters } from '../../../models/query-parameters.model';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { Observable } from 'rxjs';
import { PagedResult } from '../../../models/paged-result.model';
import { RpgSystem, RpgSystemCreateDto, RpgSystemDetail } from './rpg-system.model';


@Injectable({
  providedIn: 'root'
})
export class RpgSystemService {
  private apiUrl: string = `${environment.apiUrl}/RpgSystem`;


  constructor(private http: HttpClient) { }

  getRpgSystems(params: QueryParameters): Observable<PagedResult<RpgSystem>> {
    let httpParams = new HttpParams()
      .set('pageNumber', params.pageNumber.toString())
      .set('pageSize', params.pageSize.toString());

    if (params.searchTerm)
      httpParams = httpParams.set('searchTerm', params.searchTerm);

    return this.http.get<PagedResult<RpgSystem>>(this.apiUrl, { params: httpParams });
  }

  getRpgSystemById(id: number): Observable<RpgSystemDetail> {
    return this.http.get<RpgSystemDetail>(`${this.apiUrl}/${id}`);
  }

  createRpgSystem(newRpgSystem: RpgSystemCreateDto): Observable<RpgSystem> {
    return this.http.post<RpgSystem>(this.apiUrl, newRpgSystem);
  }

  updateRpgSystem(id: number, updateSystem: RpgSystemCreateDto): Observable<RpgSystem> {
    return this.http.put<RpgSystem>(`${this.apiUrl}/${id}`,  updateSystem );
  }
  deleteRpgSystem(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

}
