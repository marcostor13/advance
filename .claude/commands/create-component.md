---
description: Scaffold an Angular 21 standalone component following Advance Group conventions. Usage: /create-component <feature-name> [<component-name>]
---

Create an Angular 21 standalone component for the Advance Group frontend.

**Input**: $ARGUMENTS (e.g. "home hero" or just "shared button")

**Steps**:
1. Parse feature and component name from $ARGUMENTS
2. Determine the path: `frontend/src/app/features/<feature>/` or `frontend/src/app/shared/components/<name>/`
3. Create these files (do NOT use `ng generate` — write files directly):

**`<name>.component.ts`**
```typescript
import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-<name>',
  standalone: true,
  imports: [],
  templateUrl: './<name>.component.html',
  styleUrl: './<name>.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class <Name>Component {}
```

**`<name>.component.html`** — Semantic HTML with BEM class names

**`<name>.component.scss`** — BEM structure, use CSS custom properties from styles.scss

**`<name>.component.spec.ts`**
```typescript
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { <Name>Component } from './<name>.component';

describe('<Name>Component', () => {
  let component: <Name>Component;
  let fixture: ComponentFixture<<Name>Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [<Name>Component],
    }).compileComponents();
    fixture = TestBed.createComponent(<Name>Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
```

4. If it's a feature page, add a lazy route to `app.routes.ts`
5. Report: files created, route added (if applicable)
