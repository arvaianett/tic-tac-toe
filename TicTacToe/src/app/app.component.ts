import { Component, OnInit } from '@angular/core';
import { FormControl, FormBuilder, FormArray, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent implements OnInit {
  public tableSizeInput: FormControl;
  public tableSize: number;
  public visibleTable: boolean;
  public table: FormGroup;
  public winner: string;

  // get a list of points with symbols where you need only one step to win
  public winningPossibilities: any[];

  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    this.tableSizeInput = new FormControl('');
    this.visibleTable = false;
    this.winningPossibilities = [];
    this.table = this.fb.group({
      values: this.fb.array([])
    });
  }

  getTable(): void {
    this.visibleTable = true;
    this.tableSize = Number(this.tableSizeInput.value);
    // Add values to our table dynamically according to the user input
    const tableAsFormArray = this.table.get('values') as FormArray;
    for (let i = 0; i < Number(this.tableSizeInput.value); i++) {
      for (let j = 0; j < Number(this.tableSizeInput.value); j++) {
        tableAsFormArray.push(this.fb.group({ x: i, y: j, v: null }));
      }
    }
  }

  getResult(): void {
    this.table.value.values.map(cell => {
      // Check the possible directions if the observed cell has value
      if (cell.v) {
        // Check x asc
        if (this.getCell(cell.x + 1, cell.y) && this.getCell(cell.x + 2, cell.y)) {
          if (cell.v === this.getCell(cell.x + 1, cell.y).v && this.getCell(cell.x + 1, cell.y).v === this.getCell(cell.x + 2, cell.y).v) {
            this.winner = cell.v;
          } else if (cell.v === this.getCell(cell.x + 1, cell.y).v && !this.getCell(cell.x + 2, cell.y).v) {
            this.winningPossibilities.push({cell: this.getCell(cell.x + 2, cell.y), symbol: cell.v});
          } else if (cell.v === this.getCell(cell.x + 2, cell.y).v && !this.getCell(cell.x + 1, cell.y).v) {
            this.winningPossibilities.push({cell: this.getCell(cell.x + 1, cell.y), symbol: cell.v});
          }
        }
        // Check y asc
        if (this.getCell(cell.x, cell.y + 1) && this.getCell(cell.x, cell.y + 2)) {
          if (cell.v === this.getCell(cell.x, cell.y + 1).v && this.getCell(cell.x, cell.y + 1).v === this.getCell(cell.x, cell.y + 2).v) {
            this.winner = cell.v;
          } else if (cell.v === this.getCell(cell.x, cell.y + 1).v && !this.getCell(cell.x, cell.y + 2).v) {
            this.winningPossibilities.push({cell: this.getCell(cell.x, cell.y + 2), symbol: cell.v});
          } else if (cell.v === this.getCell(cell.x, cell.y + 2).v && !this.getCell(cell.x, cell.y + 1).v) {
            this.winningPossibilities.push({cell: this.getCell(cell.x, cell.y + 1), symbol: cell.v});
          }
        }
        // Check diagonal direction
        if (this.getCell(cell.x + 1, cell.y + 1) && this.getCell(cell.x + 2, cell.y + 2)) {
          if (cell.v === this.getCell(cell.x + 1, cell.y + 1).v && this.getCell(cell.x + 1, cell.y + 1).v === this.getCell(cell.x + 2, cell.y + 2).v) {
            this.winner = cell.v;
          } else if (cell.v === this.getCell(cell.x + 1, cell.y + 1).v && !this.getCell(cell.x + 2, cell.y + 2).v) {
            this.winningPossibilities.push({cell: this.getCell(cell.x + 2, cell.y + 2), symbol: cell.v});
          } else if (cell.v === this.getCell(cell.x + 2, cell.y + 2).v && !this.getCell(cell.x + 1, cell.y + 1).v) {
            this.winningPossibilities.push({cell: this.getCell(cell.x + 1, cell.y + 1), symbol: cell.v});
          }
        }
      } else {
        // Check the possible directions if the observed cell has no value
        // Check x asc
        if (this.getCell(cell.x + 1, cell.y) && this.getCell(cell.x + 2, cell.y)) {
          if (this.getCell(cell.x + 1, cell.y).v === this.getCell(cell.x + 2, cell.y).v && this.getCell(cell.x + 1, cell.y).v) {
            this.winningPossibilities.push({cell: cell, symbol: this.getCell(cell.x + 1, cell.y).v});
          }
        }
        // Check y asc
        if (this.getCell(cell.x, cell.y + 1) && this.getCell(cell.x, cell.y + 2)) {
          if (this.getCell(cell.x, cell.y + 1).v === this.getCell(cell.x, cell.y + 2).v && this.getCell(cell.x, cell.y + 1).v) {
            this.winningPossibilities.push({cell: cell, symbol: this.getCell(cell.x, cell.y + 1).v});
          }
        }
        // Check diagonal direction
        if (this.getCell(cell.x + 1, cell.y + 1) && this.getCell(cell.x + 2, cell.y + 2)) {
          if (this.getCell(cell.x + 1, cell.y + 1).v === this.getCell(cell.x + 2, cell.y + 2).v && this.getCell(cell.x + 1, cell.y + 1).v) {
            this.winningPossibilities.push({cell: cell, symbol: this.getCell(cell.x + 1, cell.y + 1).v});
          }
        }
      }
    });
  }

  getCell(x: number, y: number): Cell {
    if (this.table.value.values.filter(cell => cell.x === x && cell.y === y)[0]) {
      return this.table.value.values.filter(cell => cell.x === x && cell.y === y)[0];
    }
  }
}

interface Cell {
  x: number;
  y: number;
  v: string;
}
