import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { PagedResult } from '../../../models/paged-result.model';
import { Character } from '../../../models/character.model';
import { CharactersService } from '../characters.service';
import { QueryParameters } from '../../../models/query-parameters.model';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-character-list',
  imports: [RouterLink, FormsModule],
  templateUrl: './character-list.component.html',
  styleUrl: './character-list.component.scss'
})
export class CharacterListComponent implements OnInit {
  public pagedCharacters: PagedResult<Character> | null = null;
  public params = new QueryParameters();

  constructor(private characterService: CharactersService) { }
  
  ngOnInit(): void {
    this.loadCharacters();
  }

  loadCharacters() {
    this.characterService.getCharacters(this.params).subscribe({
      next: (response) => {
        this.pagedCharacters = response;
        console.log("Tudo certo no loadCharacters");
      },
      error: (err) => {
        console.error("Error no loadCharacters:", err);
      }        
    })
  }
  
  goToPage(page: number): void {
    this.params.pageNumber = page;
    this.loadCharacters();
  }
}
