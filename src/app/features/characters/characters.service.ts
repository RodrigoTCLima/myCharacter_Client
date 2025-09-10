import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { QueryParameters } from '../../models/query-parameters.model';
import { Observable } from 'rxjs';
import { PagedResult } from '../../models/paged-result.model';
import { Character, CharacterCreateDto, CharacterDetail, CharacterUpdateDto } from '../../models/character.model';

@Injectable({
  providedIn: 'root'
})
export class CharactersService {
  private apiUrl = `${environment.apiUrl}/characters`;

  constructor(private http: HttpClient) { }

  getCharacters(params: QueryParameters): Observable<PagedResult<Character>>{
    let httpParams = new HttpParams()
      .set('pageNumber', params.pageNumber.toString())
      .set('pageSize', params.pageSize.toString());
    
    if (params.searchTerm)
      httpParams = httpParams.set('searchTerm', params.searchTerm);

    return this.http.get<PagedResult<Character>>(this.apiUrl, { params: httpParams });
  }

  getCharacterById(id: string): Observable<CharacterDetail>{
    return this.http.get<CharacterDetail>(`${this.apiUrl}/${id}`);
  }

  createCharacter(newCharacter: CharacterCreateDto): Observable<CharacterDetail>{
    return this.http.post<CharacterDetail>(this.apiUrl, newCharacter);
  }

  updateCharacter(id: string, characterData: CharacterUpdateDto): Observable<CharacterDetail> {
    return this.http.put<CharacterDetail>(`${this.apiUrl}/${id}`, characterData);
  }

  deleteCharacter(id: string): Observable<any>{
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
