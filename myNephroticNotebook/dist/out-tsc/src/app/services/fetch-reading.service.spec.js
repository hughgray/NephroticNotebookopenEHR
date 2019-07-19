import { TestBed } from '@angular/core/testing';
import { FetchReadingService } from './fetch-reading.service';
describe('FetchReadingService', function () {
    beforeEach(function () { return TestBed.configureTestingModule({}); });
    it('should be created', function () {
        var service = TestBed.get(FetchReadingService);
        expect(service).toBeTruthy();
    });
});
//# sourceMappingURL=fetch-reading.service.spec.js.map