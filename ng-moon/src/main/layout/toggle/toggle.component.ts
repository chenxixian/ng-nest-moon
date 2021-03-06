import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { LayoutService } from '../layout.service';

@Component({
  selector: 'nm-toggle',
  templateUrl: './toggle.component.html',
  encapsulation: ViewEncapsulation.None
})
export class ToggleComponent implements OnInit {

  constructor(public layoutService: LayoutService) { }

  ngOnInit() {
  }

  /**
   * 展开，缩起点击
   * 
   * @memberof ToggleComponent
   */
  toggle() {
    this.layoutService.local = { siderShrink: !this.layoutService.local.siderShrink }
  }
}
