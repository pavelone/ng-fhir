ng-fhir
=======

FHIR API AngularJS module

[![Build Status](https://travis-ci.org/fhirbase/ng-fhir.svg)](https://travis-ci.org/fhirbase/ng-fhir)

## Installation

Install with `bower`:

```shell
bower install ng-fhir
```

Add a `<script>` to your `index.html`:

```html
<script src="/bower_components/ng-fhir/ng-fhir.js"></script>
```

And add `ng-fhir` as a dependency for your app:

```javascript
angular.module('myApp', ['ng-fhir']);
```

## Development
`nodejs` is required for build.
We recommend install it using [nvm](https://github.com/creationix/nvm/blob/master/README.markdown)

```
git clone https://github.com/fhirbase/ng-fhir
cd ng-fhir
npm install
`npm bin`/grunt
```
