import { TestBed } from '@angular/core/testing';
import { DatabaseService } from './database.service';
describe('DatabaseService', function () {
    beforeEach(function () { return TestBed.configureTestingModule({}); });
    it('should be created', function () {
        var service = TestBed.get(DatabaseService);
        expect(service).toBeTruthy();
    });
});
//# sourceMappingURL=database.service.spec.js.map