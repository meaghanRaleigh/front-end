import { Component, OnInit } from '@angular/core';
import { Animal } from 'src/app/models/animal';
import { IStringMap } from 'src/app/utils/string-map';
import { AnimalService } from './animal.service';

@Component({
  selector: 'fe-main',
  templateUrl: './main.component.html',
})
export class MainComponent implements OnInit {
  public animalsByClass: IStringMap<Animal[]> = {};

  constructor(private animalService: AnimalService) {}

  public ngOnInit(): void {
    this.getAnimalsByContinent();
  }

  public getAnimalsByContinent(): void {
    this.animalService.getAnimalsByContinent().subscribe((animals) => {
      this.animalsByClass = this.getAnimalsByClass(animals);
    });
  }

  // Transform the "animalsByContinent" object (see mock-animals.ts) so that animals
  // across every continent are organized by "class" and alphabetized by "name".
  // Remove any duplicates. Try to make the transformation efficient as you may have
  // to manipulate a very large dataset.
  //
  // The result should be an object with a single key for each distinct animal
  // class within the dataset (mammal, reptile, bird, etc.) Each of these class
  // keys should map to a list of animal objects of that class (see the adjacent
  // test file and view the getMockAnimalsByClass() function for an example).
  // These lists should not contain duplicates and should be alphabetized from
  // "A" to "z".
  public getAnimalsByClass(
    animals: IStringMap<Animal[]>
  ): IStringMap<Animal[]> {
    let sortedAnimals = {};
    // get the entries of animals based on continent and animal itself
    for (const [continentName, continentAnimals] of Object.entries(animals)) {
      // loop through the animals on each continent
      continentAnimals.forEach((animal, index) => {
        //if we don't have an array started for this animal class, make sure we've got one
        if (
          animal.class in sortedAnimals ||
          (sortedAnimals[animal.class] = [])
        ) {
          // if we don't already have this animal in this array, add it
          if (
            !sortedAnimals[animal.class].find((elem) => elem.id === animal.id)
          ) {
            // push animals to class and display
            sortedAnimals[animal.class].push(animal);
          }
        }
        // now that we've reached the last iteration of animals on this continent,
        // let's go ahead and sort them alphabetically
        if (index === continentAnimals.length - 1) {
          sortedAnimals[animal.class].sort((a, b) =>
            a.name.localeCompare(b.name)
          );
        }
      });
    }
    //print out the sorted distinct animals here
    return sortedAnimals;
  }
}
