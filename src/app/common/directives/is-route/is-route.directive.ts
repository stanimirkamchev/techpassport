import { Directive, Input, ElementRef, OnDestroy } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Directive({
  selector: '[isRoute]'
})
export class IsRouteDirective implements OnDestroy {

  private _isRoute: string;
  private directiveDestroyed$ = new Subject();

  @Input('isRoute')
  set isRoute(isRoute: string) {
    this._isRoute = isRoute;
    this.checkCondition();
  }

  constructor(private elementRef: ElementRef, private router: Router) {
    this.router.events
      .pipe(takeUntil(this.directiveDestroyed$))
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(this.checkCondition.bind(this));
  }

  ngOnDestroy() {
    this.directiveDestroyed$.next();
    this.directiveDestroyed$.complete();
  }

  private checkCondition() {
    if (this._isRoute) {
      const isMatched = this.isMatched(this._isRoute, this.buildUrlFromSegments());
      this.elementRef.nativeElement.style.display = isMatched ? 'flex' : 'none';
    }
  }

  private isMatched(condition: string, given: string): boolean {
    return condition.indexOf('*') < 0
      ? condition === given
      : !!given.match(this.buildPattern(condition));
  }

  private buildPattern(condition: string): RegExp {
    /** @todo check for RegExp injection vulnerabilities */
    const pattern = condition
      .replace(/\//g, '\\/')
      .split('*')
      .join('[\\s\\S]*');
    return new RegExp(`^${pattern}$`);
  }

  private buildUrlFromSegments(): string {
    const activeUrl = this.router.routerState.snapshot.url;
    const urlTree = this.router.parseUrl(activeUrl);
    return '/' + urlTree.root.children['primary'].segments.map(segment => segment.path).join('/');
  }
}
