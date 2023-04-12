// todo.service.spec.ts

import { DBService } from './firebaseDB'
import  mocked  from 'ts-jest'

jest.mock('')

describe('TodoService', () => {
    let service: DBService

    beforeEach(() => {
        service = new DBService()
    })

    describe('giveMeANumber', () => {
        test('when value is true, then should return true', () => {
            expect(true).toBe(true)
        })

        it('should return 5, when given parameter is 5', () => {
            const number = service.unFollow("test", "test")
            expect(number).toBe(5)
        })
    })
})