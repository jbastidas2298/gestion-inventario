import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-configuracion-menu',
  templateUrl: './configuracion-menu.component.html',
  styleUrls: ['./configuracion-menu.component.scss']
})
export class ConfiguracionMenuComponent implements OnInit {

  constructor(
    private router: Router,
  ) { }

  ngOnInit() {
  }
  navigateTo(route: string): void {
    this.router.navigate([route]);
  }
}
