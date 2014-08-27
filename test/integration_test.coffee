jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000
app = angular.module('test', ['ng-fhir'])
.config ($httpProvider)->
  $httpProvider.defaults.useXDomain = true
  delete $httpProvider.defaults.headers.common['X-Requested-With']

describe "linearizeParams:", ->
  subject = null
  http = null

  beforeEach(module('test'))
  beforeEach(inject(($fhir, $http)-> subject = $fhir; http=$http))

  it "simplest", (done) ->
    # subject.metadata()
    http(method:'GET', url: 'http://try-fhirplace.hospital-systems.com/metadata')
      .success (data)->
        console.log('Data', data)
        done()
      .error (err)->
        console.log('Error', arguments)
        done()
