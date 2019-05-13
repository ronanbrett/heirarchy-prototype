import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserSelectorComponent } from './user-selector.component';
import { UserSelectorModule } from './user-selector.module';
import { LoginService } from '../../auth/login.service';
import { LoginServiceMock } from '../../../../testing/mocks/loginService.mock';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('UserSelectorComponent', () => {
  let component: UserSelectorComponent;
  let fixture: ComponentFixture<UserSelectorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [UserSelectorModule, NoopAnimationsModule],
      declarations: [],
      providers: [{ provide: LoginService, useClass: LoginServiceMock }]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
