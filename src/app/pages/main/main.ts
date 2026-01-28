import { Component } from '@angular/core';
import { ToolbarComponent } from "../../shared/ui/toolbar/toolbar";
import { RouterOutlet } from "@angular/router";

@Component({
  selector: 'app-main',
  imports: [ToolbarComponent, RouterOutlet],
  templateUrl: './main.html',
  styleUrl: './main.scss',
})
export class Main {

}
