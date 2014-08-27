angular.module('test', ['ng-fhir'])

describe "linearizeParams:", ->
  subject = null

  beforeEach(module('test'))
  beforeEach  inject(($fhirSearchInternal)->
    subject = $fhirSearchInternal.linearizeParams
)

  it "simplest", ->
    expect(subject(a:1,b:2))
      .toEqual([{param: 'a', value: [1]},{param: 'b',value: [2]}])

  it "modifier", ->
    expect(subject(a: {$exact: 2}))
      .toEqual([{param: 'a', modifier: ':exact', value: [2]}])

  it "operator", ->
    expect(subject(a: {$lt: 2}))
      .toEqual([{param: 'a', operator: '<', value: [2]}])

  it "and", ->
    expect(subject(a: {$and: [1, 2]}))
      .toEqual([{param: 'a', value: [1]}, {param: 'a',value: [2]}])

  it "compound", ->
    expect(subject(a: [1, 2]))
      .toEqual([{param: 'a', value: ['1|2']}])

  it "or", ->
    expect(subject(a: {$or: [1, 2]}))
      .toEqual([{param: 'a', value: [1,2]}])

  it "operator & or", ->
    expect(subject(a: {$exact: {$or: [1,2]}}))
      .toEqual([{param: 'a', modifier: ':exact', value: [1,2]}])

  it "chained params", ->
    expect(subject(subject: {name: {$exact: 'abu'}, birthDate: {$gt: '2000'}}))
      .toEqual([
        {param: 'subject.name', modifier: ':exact', value: ['abu']}
        {param: 'subject.birthDate', operator: '>', value: ['2000']}
      ])

describe "test params builder", ->
  subject = null

  beforeEach(module('test'))
  beforeEach  inject(($fhirSearchBuilder)-> subject = $fhirSearchBuilder)

  it "simple cases", ->
    expect(subject(name: 'buka'))
      .toBe('name=buka')

    expect(subject(name: {$exact: 'buka'}))
      .toBe('name:exact=buka')

    expect(subject(birthDate: {$gt: '2011'}))
      .toBe('birthDate=>2011')

    expect(subject(birthDate: {$gt: '2011', $lt: '2014'}))
      .toBe('birthDate=>2011&birthDate=<2014')

    console.log(subject(birthDate: {$gt: '2011', $lt: '2014'}))
