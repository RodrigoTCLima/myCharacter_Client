import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { Campaign } from './campaign.model';
import { QueryParameters } from '../../models/query-parameters.model';
import { PagedResult } from '../../models/paged-result.model';

@Injectable({
  providedIn: 'root'
})
export class CampaignsService {
  private apiUrl = `${environment.apiUrl}/campaigns`;

  constructor(private http: HttpClient) { }

  getCampaigns(params: QueryParameters): Observable<PagedResult<Campaign>> {
    let httpParams = new HttpParams()
      .set('pageNumber', params.pageNumber.toString())
      .set('pageSize', params.pageSize.toString());

    if (params.searchTerm)
      httpParams = httpParams.set('searchTerm', params.searchTerm);

    return this.http.get<PagedResult<Campaign>>(this.apiUrl, { params: httpParams });
  }
}
