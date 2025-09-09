import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { QueryParameters } from '../../models/query-parameters.model';
import { PagedResult } from '../../models/paged-result.model';
import { Campaign, CampaignCreateDto, CampaignDetail, CampaignUpdateDto } from '../../models/campaign.model';

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

  createCampaigns(newCampaign: CampaignCreateDto): Observable<Campaign>{
    return this.http.post<Campaign>(this.apiUrl, newCampaign);
  }

  getCampaignById(id: string): Observable<CampaignDetail> {
    return this.http.get<CampaignDetail>(`${this.apiUrl}/${id}`);
  }

  updateCampaign(id: string, campaignData: CampaignUpdateDto): Observable<CampaignDetail> {
    return this.http.put<CampaignDetail>(`${this.apiUrl}/${id}`, campaignData);
  }

  deleteCampaign(id: string): Observable<any>{
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
