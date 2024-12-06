import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-inventario-menu',
  templateUrl: './inventario-menu.component.html',
  styleUrls: ['./inventario-menu.component.scss']
})
export class InventarioMenuComponent implements OnInit {

  constructor(
    private router: Router,
  ) { }

  ngOnInit() {
  }
  navigateTo(route: string): void {
    this.router.navigate([route]);
  }
}
