import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { EditprofilePage } from './editprofile.page';

describe('EditprofilePage', () => {
  let component: EditprofilePage;
  let fixture: ComponentFixture<EditprofilePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditprofilePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(EditprofilePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
