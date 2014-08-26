angular.module('test', ['ng-fhir'])

describe "test params builder", ->
  params = null

  beforeEach(module('test'))
  beforeEach  inject(($fhirParams)-> params = $fhirParams)

  it "contains spec with an expectation", ->
    expect(true).toBe(true)
