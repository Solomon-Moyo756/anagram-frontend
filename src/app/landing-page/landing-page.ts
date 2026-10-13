import { HttpErrorResponse } from '@angular/common/http';
import { NgFor, NgIf } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { AnagramApiService, WordDto } from '../anagram-api.service';

@Component({
  standalone: true,
  imports: [
    MatButtonModule,
    MatIconModule,
    MatPaginatorModule,
    MatTableModule,
    NgFor,
    NgIf,
    ReactiveFormsModule
  ],
  selector: 'app-landing-page',
  styleUrls: ['./landing-page.css'],
  templateUrl: './landing-page.html',
})
export class LandingPageComponent {
  private readonly api = inject(AnagramApiService);

  words: WordDto[] = [];
  wordSearch = '';
  pageIndex = 0;
  pageSize = 10;
  busy = false;
  errorMessage = '';
  successMessage = '';
  stats: Record<string, number> | null = null;
  statsExecutionTimeMs: number | null = null;
  anagramResult: { word: string; words: WordDto[] } | null = null;

  readonly newWord = new FormControl('', {
    nonNullable: true,
    validators: [Validators.required, Validators.pattern(/\S/)]
  });

  get filteredWords(): WordDto[] {
    const searchText = this.wordSearch.trim().toLowerCase();
    if (!searchText) {
      return this.words;
    }

    return this.words
      .filter(({ value }) => value.toLowerCase().includes(searchText))
      .sort((firstWord, secondWord) => {
        const firstValue = firstWord.value.toLowerCase();
        const secondValue = secondWord.value.toLowerCase();
        const firstRank = this.getWordMatchRank(firstValue, searchText);
        const secondRank = this.getWordMatchRank(secondValue, searchText);

        return firstRank - secondRank || firstValue.localeCompare(secondValue);
      });
  }

  get pageWords(): WordDto[] {
    const startIndex = this.pageIndex * this.pageSize;
    return this.filteredWords.slice(startIndex, startIndex + this.pageSize);
  }

  get statEntries(): [string, number][] {
    return Object.entries(this.stats ?? {}).sort(
      ([firstLength], [secondLength]) => Number(firstLength) - Number(secondLength)
    );
  }

  constructor() {
    this.refreshWords();
  }

  refreshWords(): void {
    if (this.busy) {
      return;
    }

    this.startRequest();
    this.api.getWords().subscribe({
      next: (response) => {
        this.words = response.data;
        this.adjustPageIndex();
      },
      error: (error: unknown) => this.showError(error, 'Could not load words'),
      complete: () => this.finishRequest()
    });
  }

  addWord(): void {
    const word = this.newWord.value.trim();
    if (!word || this.busy) {
      this.newWord.markAsTouched();
      return;
    }

    this.startRequest();
    this.api.addWord(word).subscribe({
      next: (wasAdded) => {
        if (!wasAdded) {
          this.errorMessage = `Could not add “${word}”. It may already exist.`;
          this.finishRequest();
          return;
        }

        this.newWord.reset('');
        this.successMessage = `“${word}” was added.`;
        this.reloadWords();
      },
      error: (error: unknown) => this.showError(error, 'Could not add the word')
    });
  }

  deleteWord(word: string): void {
    if (this.busy) {
      return;
    }

    this.startRequest();
    this.api.deleteWord(word).subscribe({
      next: (wasDeleted) => {
        if (!wasDeleted) {
          this.errorMessage = `Could not delete “${word}”. It may not exist in the database.`;
          this.finishRequest();
          return;
        }

        this.successMessage = `“${word}” was deleted.`;
        this.reloadWords();
      },
      error: (error: unknown) => this.showError(error, 'Could not delete the word')
    });
  }

  getStats(): void {
    if (this.busy) {
      return;
    }

    this.startRequest();
    this.api.getStats().subscribe({
      next: (response) => {
        this.stats = response.data;
        this.statsExecutionTimeMs = response.executionTimeMs;
      },
      error: (error: unknown) => this.showError(error, 'Could not load statistics'),
      complete: () => this.finishRequest()
    });
  }

  getAnagrams(word: string): void {
    if (this.busy) {
      return;
    }

    this.startRequest();
    this.api.getAnagrams(word).subscribe({
      next: (response) => {
        this.anagramResult = { word, words: response.data };
      },
      error: (error: unknown) => this.showError(error, `Could not find anagrams for “${word}”`),
      complete: () => this.finishRequest()
    });
  }

  onPageChange(event: PageEvent): void {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
  }

  setWordSearch(searchText: string): void {
    this.wordSearch = searchText;
    this.pageIndex = 0;
  }

  trackStatEntry(_index: number, entry: [string, number]): string {
    return entry[0];
  }

  trackAnagram(_index: number, anagram: WordDto): string {
    return anagram.value;
  }

  private reloadWords(): void {
    this.api.getWords().subscribe({
      next: (response) => {
        this.words = response.data;
        this.adjustPageIndex();
      },
      error: (error: unknown) =>
        this.showError(error, 'The change succeeded, but the word list could not be refreshed'),
      complete: () => this.finishRequest()
    });
  }

  private startRequest(): void {
    //reseting values
    this.busy = true;
    this.errorMessage = '';
    this.successMessage = '';
  }

  private finishRequest(): void {
    this.busy = false;
  }

  private showError(error: unknown, message: string): void {
    console.error(message, error);

    let extraMessage = '';
    if (error instanceof HttpErrorResponse && error.status === 0) {
      extraMessage = ' Check that the Spring Boot API is running.';
    } else if (error instanceof HttpErrorResponse && error.error?.message) {
      extraMessage = ` ${error.error.message}`;
    }

    this.errorMessage = `${message}.${extraMessage}`;
    this.finishRequest();
  }

  private adjustPageIndex(): void {
    const lastPageIndex = Math.max(
      0,
      Math.ceil(this.filteredWords.length / this.pageSize) - 1
    );
    this.pageIndex = Math.min(this.pageIndex, lastPageIndex);
  }

  private getWordMatchRank(word: string, searchText: string): number {
    if (word === searchText) {
      return 0;
    }

    const matchIndex = word.indexOf(searchText);
    return matchIndex === 0 ? 1 : matchIndex + 1;
  }
}
