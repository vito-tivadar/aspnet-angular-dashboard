import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-personal-data',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './personal-data.html',
  styleUrl: './personal-data.css',
})
export class PersonalDataComponent {}
