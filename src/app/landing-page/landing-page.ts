import { Component } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
@Component({
  imports: [MatTableModule,CommonModule,
  MatTableModule,
  MatPaginatorModule,
  MatButtonModule,
  MatIconModule],
  selector: 'app-landing-page',
  styleUrl: './landing-page.css',
  templateUrl: './landing-page.html',
})
export class LandingPageComponent {  displayedColumns: string[] = ['word', 'actions'];
  dataSource = new MatTableDataSource<{ word: string }>([
    { word: 'hi' },
    { word: 'hello' },
    { word: 'hey' },
    { word: 'ehy' }
  ]);

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  deleteWord(word: string) {
    this.dataSource.data = this.dataSource.data.filter(w => w.word !== word);
  }

  getAnagrams(word: string) {
    // TODO: implement logic to fetch anagrams
    console.log(`Get anagrams for: ${word}`);
  }

  refreshWords() {
    // TODO: implement refresh logic (e.g., API call)
    console.log('Refreshing words...');
  }

  getStats() {
    // TODO: implement stats logic
    console.log('Getting stats for all words...');
  }

  addWord(newWord: string) {
    this.dataSource.data = [...this.dataSource.data, { word: newWord }];
  }
}
