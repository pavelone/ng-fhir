ng-fhir
=======

[![Build Status](https://travis-ci.org/fhirbase/ng-fhir.svg)](https://travis-ci.org/fhirbase/ng-fhir)

FHIR API AngularJS module.

`ng-fhir` provide `$fhir` service
for interaction with [FHIR-complaint servers](http://www.hl7.org/implement/standards/fhir/index.html)
from your AngularJS application.

## Installation

Install [ng-fhir](http://bower.io/search/?q=ng-fhir) with `bower`:

```shell
bower install ng-fhir
```

Add a `<script>` to your `index.html`:

```html
<script src="/bower_components/ng-fhir/ng-fhir.js"></script>
```

Use `ng-fhir` as a dependency for your app:

```javascript
angular.module('myApp', ['ng-fhir'])
.config(function ($provide, $fhirProvider) {
  $fhirProvider.cors = true
  $fhirProvider.baseUrl='http://fhir.healthintersections.com.au/open'
})
.controller('myController', function($scope, $fhir){
  //...

  $fhir.create('Patient', {name: [{family: ['Askold']}]})
  .then(function(resource){ ... })

  //...

  $fhir.search('Patient',{name: 'maud'})
  .then(function(bundle){ $scope.patients = bundle.entry })

  //...
})
```

## API

### Conformance & Profiles

### Resource's CRUD

### Tags

### Search

`$fhir.search()` function is used for [FHIR resource's search](http://www.hl7.org/implement/standards/fhir/search.html)

```javasctipt
myController = function($scope, $fhir){
  queryObject = {name: 'maud', sort: {$desc: 'birthDate'}}
  $fhir.search('Patient', queryObject)
  .then(function(bundle){
     $scope.patients = bundle.entry
  })
}
```

For queryObject syntax `ng-fhir` adopts
mongodb-like query syntax ([see](http://docs.mongodb.org/manual/tutorial/query-documents/)):

```javascrip
{name: 'maud'} //=> name=maud
{name: {$exact: 'maud'}} //=> name:exact=maud
{name: {$or: ['maud','dave']}} //=> name=maud,dave
{name: {$and: ['maud',{$exact: 'dave'}]}} //=> name=maud&name:exact=Dave
{birthDate: {$gt: '1970', $lte: '1980'}} //=> birthDate=>1970&birthDate=<=1980

{subject: {$type: 'Patient', name: 'maud', birthDate: {$gt: '1970'}}} #=> subject:Patient.name=maud&subject:Patient.birthDate=>1970
{'subject.name': {$exact: 'maud'}} #=> subject.name:exact=maud
```

For more information see [tests](https://github.com/fhirbase/ng-fhir/blob/master/test/fhir_params_test.coffee)

## Development

`nodejs` is required for build.

We recommend install it using [nvm](https://github.com/creationix/nvm/blob/master/README.markdown)

Build & test:

```
git clone https://github.com/fhirbase/ng-fhir
cd ng-fhir
npm install
`npm bin`/grunt build
node_modules/karma/bin/karma start --single-run
```
