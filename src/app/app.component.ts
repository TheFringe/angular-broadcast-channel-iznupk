import { Component, VERSION } from '@angular/core';
import { PokemonService } from './pokemon.service';

@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  pokemon = '';
  constructor(public pokemonService: PokemonService) {}
}
