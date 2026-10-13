import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

export interface WordDto {
  value: string;
}

export interface ApiResponse<T> {
  data: T;
  executionTimeMs: number;
}

@Injectable({ providedIn: 'root' })
export class AnagramApiService {

  private readonly http = inject(HttpClient);
  private readonly apiUrl = '/anagrams';

  getWords(): Observable<ApiResponse<WordDto[]>> {
    return this.http.get<ApiResponse<WordDto[]>>(`${this.apiUrl}/words`);
  }

  getStats(): Observable<ApiResponse<Record<string, number>>> {
    return this.http.get<ApiResponse<Record<string, number>>>(`${this.apiUrl}/stats`);
  }

  getAnagrams(word: string): Observable<ApiResponse<WordDto[]>> {
    return this.http.get<ApiResponse<WordDto[]>>(`${this.apiUrl}/anagram-for-word`, {
      params: { word }
    });
  }

  addWord(value: string): Observable<Boolean> {
    return this.http.post<Boolean>(`${this.apiUrl}/add-word`, null, {
      params: { value }
    });
  }

  deleteWord(value: string): Observable<Boolean> {
    return this.http.delete<Boolean>(`${this.apiUrl}/delete-word`, {
      params: { value }
    });
  }
}
