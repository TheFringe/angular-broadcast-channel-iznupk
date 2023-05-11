import { Injectable } from '@angular/core';
import { BehaviorSubject, fromEvent, merge } from 'rxjs';
import { map, tap } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class PokemonService {
  pokemonChannel = new BroadcastChannel('pokemon');

  resendChannel = new BroadcastChannel('resend');

  counterChannel = new BroadcastChannel('clientCounter');

  private clientId = 0;
  constructor() {
    this.resendChannel.onmessage = (event) => {
      this.pokemonChannel.postMessage(this.pokemonsSubject$.getValue());
    };

    this.counterChannel.postMessage('getID');
    this.counterChannel.onmessage = (event) => {
      console.log(event);
      if (event.data === 'getID') {
        this.counterChannel.postMessage(++this.clientId);
      } else if (Number(event.data) > 0) {
        this.clientId = Number(event.data);
      }
    };
  }

  private pokemonsSubject$ = new BehaviorSubject<string[]>([]);
  private pokemonBroadcast$ = fromEvent(this.pokemonChannel, 'message').pipe(
    tap(console.log),
    map((event: any) => event.data)
  );

  pokemons$ = merge(this.pokemonsSubject$, this.pokemonBroadcast$);

  addPokemon(pokemon: string) {
    this.pokemonsSubject$.next([...this.pokemonsSubject$.getValue(), pokemon]);
    this.pokemonChannel.postMessage(this.pokemonsSubject$.getValue());
  }

  resendPokemons() {
    this.resendChannel.postMessage('giveme');
  }
}
