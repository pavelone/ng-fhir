(function() {
  var BASE_PREFIX, NOTIFICATION_REMOVE_TIMEOUT, Query, collectChainType, collectChains, identity, keyComparator, modifiers, operations, rm, tags, _dateToQuery, _mkSearchParam, _numberToQuery, _referenceToQuery, _stringToQuery, _tokenToQuery,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  angular.module('ng-fhir', []);

  NOTIFICATION_REMOVE_TIMEOUT = 2000;

  BASE_PREFIX = '/';

  angular.module('ng-fhir').provider('$fhir', function() {
    var addKey, buildTags, extractTags;
    buildTags = function(tags) {
      return tags.filter(function(i) {
        return $.trim(i.term);
      }).map(function(i) {
        return "" + i.term + "; scheme=\"" + i.scheme + "\"; label=\"" + i.label + "\"";
      }).join(",");
    };
    addKey = function(acc, str) {
      var pair, val;
      if (!str) {
        return;
      }
      pair = str.split("=").map($.trim);
      val = pair[1].replace(/(^"|"$)/g, '');
      if (val) {
        acc[pair[0]] = val;
      }
      return acc;
    };
    extractTags = function(categoryHeader) {
      if (!categoryHeader) {
        return [];
      }
      return categoryHeader.split(',').map(function(x) {
        var acc, parts;
        parts = $.trim(x).split(';').map($.trim);
        if (parts[0]) {
          acc = {
            term: parts[0]
          };
          addKey(acc, parts[1]);
          addKey(acc, parts[2]);
          return acc;
        }
      });
    };
    return {
      $get: function($http, $timeout) {
        var http, prov;
        prov = {
          active: 0,
          notifications: [],
          error: null,
          metadata: function(cb) {
            var uri;
            uri = "" + BASE_PREFIX + "metadata";
            return http({
              method: 'GET',
              url: uri
            }).success(cb);
          },
          tags_all: function(cb) {
            var uri;
            uri = "" + BASE_PREFIX + "_tags";
            return http({
              method: 'GET',
              url: uri
            }).success(cb);
          },
          tags_type: function(rt, cb) {
            var uri;
            uri = "" + BASE_PREFIX + rt + "/_tags";
            return http({
              method: 'GET',
              url: uri
            }).success(cb);
          },
          tags: function(rt, id, cb) {
            var uri;
            uri = "" + BASE_PREFIX + rt + "/" + id + "/_tags";
            return http({
              method: 'GET',
              url: uri
            }).success(cb);
          },
          tags_version: function(rt, id, vid, b) {
            var uri;
            uri = "" + BASE_PREFIX + rt + "/" + id + "/_history/" + vid + "/_tags";
            return http({
              method: 'GET',
              url: uri
            }).success(cb);
          },
          affixResourceTags: function(rt, id, tags, cb) {
            var headers, tagHeader, uri;
            uri = "" + BASE_PREFIX + rt + "/" + id + "/_tags";
            headers = {};
            tagHeader = buildTags(tags);
            if (tagHeader) {
              headers["Category"] = tagHeader;
              return http({
                method: 'POST',
                url: uri,
                headers: headers
              }).success(cb);
            } else {
              return console.log('Empty tags');
            }
          },
          removeResourceTags: function(rt, id, cb) {
            var uri;
            uri = "" + BASE_PREFIX + rt + "/" + id + "/_tags/_delete";
            return http({
              method: 'POST',
              url: uri
            }).success(cb);
          },
          profile: function(rt, cb) {
            return http({
              method: 'GET',
              url: "/Profile/" + rt
            }).success(cb);
          },
          search: function(rt, query, cb) {
            var uri;
            uri = "" + BASE_PREFIX + rt + "/_search?" + (query.toQueryString());
            return http({
              method: 'GET',
              url: uri
            }).success(cb);
          },
          create: function(rt, res, tags, cb) {
            var headers, tagHeader, uri;
            uri = "" + BASE_PREFIX + rt;
            headers = {};
            tagHeader = buildTags(tags);
            if (tagHeader) {
              headers["Category"] = tagHeader;
            }
            return http({
              method: 'POST',
              url: uri,
              data: res,
              headers: headers
            }).success(cb);
          },
          validate: function(rt, id, cl, res, cb) {
            var headers, tagHeader, uri;
            uri = "" + BASE_PREFIX + rt + "/_validate";
            if (id) {
              uri = uri + '/' + id;
            }
            headers = {};
            tagHeader = buildTags(tags);
            if (tagHeader) {
              headers["Category"] = tagHeader;
            }
            headers['Content-Location'] = cl;
            return http({
              method: 'POST',
              url: uri,
              data: res,
              headers: headers
            }).success(cb);
          },
          read: function(rt, id, cb) {
            var uri;
            uri = "" + BASE_PREFIX + rt + "/" + id;
            return http({
              method: 'GET',
              url: uri
            }).success(function(data, status, headers, config) {
              return cb(headers('Content-Location'), data, extractTags(headers('Category')));
            });
          },
          update: function(rt, id, cl, res, tags, cb) {
            var headers, tagHeader, uri;
            uri = "" + BASE_PREFIX + rt + "/" + id;
            headers = {};
            tagHeader = buildTags(tags);
            if (tagHeader) {
              headers["Category"] = tagHeader;
            }
            headers['Content-Location'] = cl;
            return http({
              method: "PUT",
              url: uri,
              data: res,
              headers: headers
            }).success(cb);
          },
          "delete": function(rt, id, cb) {
            var uri;
            uri = "" + BASE_PREFIX + rt + "/" + id;
            return http({
              method: "DELETE",
              url: uri
            }).success(cb);
          },
          history: function(rt, id, cb) {
            var uri;
            uri = "" + BASE_PREFIX + rt + "/" + id + "/_history";
            return http({
              method: 'GET',
              url: uri
            }).success(cb);
          },
          history_type: function(rt, cb) {
            var uri;
            uri = "" + BASE_PREFIX + rt + "/_history";
            return http({
              method: 'GET',
              url: uri
            }).success(cb);
          },
          history_all: function(cb) {
            var uri;
            uri = "" + BASE_PREFIX + "_history";
            return http({
              method: 'GET',
              url: uri
            }).success(cb);
          },
          removeNotification: function(i) {
            return prov.notifications.splice(prov.notifications.indexOf(i), 1);
          },
          transaction: function(bundle, cb) {
            var uri;
            uri = "" + BASE_PREFIX;
            return http({
              method: 'POST',
              url: uri,
              data: bundle
            }).success(cb);
          },
          document: function(bundle, cb) {
            var uri;
            uri = "" + BASE_PREFIX + "/Document";
            return http({
              method: 'POST',
              url: uri,
              data: bundle
            }).success(cb);
          }
        };
        http = function(params) {
          var note;
          note = angular.copy(params);
          prov.notifications.push(note);
          prov.active += 1;
          $timeout((function() {
            return prov.removeNotification(note);
          }), NOTIFICATION_REMOVE_TIMEOUT);
          params.params || (params.params = {});
          params.params._format = 'application/json';
          return $http(params).success(function(data, status, _, req) {
            prov.active -= 1;
            return note.status = status;
          }).error(function(vv, status, _, req) {
            prov.active -= 1;
            note.status = status;
            return prov.error = vv || ("Server error " + status + " while loading:  " + params.url);
          });
        };
        return prov;
      }
    };
  });

  tags = [
    {
      type: 'string',
      name: '_tag',
      documentation: 'Search by tag'
    }, {
      type: 'string',
      name: '_profile',
      documentation: 'Search by profile tag'
    }, {
      type: 'string',
      name: '_security',
      documentation: 'Search by security tag'
    }
  ];

  identity = function(x) {
    return x;
  };

  rm = function(x, xs) {
    return xs.splice(xs.indexOf(x), 1);
  };

  modifiers = {
    number: ['', 'missing'],
    string: ['', ':missing', ':exact'],
    reference: ['', ':missing'],
    token: ['', ':missing', ':text'],
    date: ['', ':missing']
  };

  operations = {
    number: ['=', '>', '>=', '<', '<='],
    date: ['=', '>', '>=', '<', '<=']
  };

  collectChains = function(profile) {
    var elemsIdx, searchParam;
    searchParam = profile.structure[0].searchParam;
    elemsIdx = profile.structure[0].differential.element.reduce((function(idx, x) {
      idx[x.path] = x;
      return idx;
    }), {});
    console.log(elemsIdx);
    return searchParam.reduce((function(acc, x) {
      var elem, path, t, _i, _len, _ref;
      if (x.type !== 'reference') {
        return acc;
      }
      path = x.xpath.replace(/f:/g, '').replace(/\//g, '.');
      elem = elemsIdx[path];
      if (!elem) {
        return acc;
      }
      _ref = elem.definition.type;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        t = _ref[_i];
        acc.push({
          sp: x,
          tp: t
        });
      }
      return acc;
    }), []);
  };

  collectChainType = function(profile) {
    var elemsIdx, searchParam, types;
    searchParam = profile.structure[0].searchParam;
    elemsIdx = profile.structure[0].differential.element.reduce((function(idx, x) {
      idx[x.path] = x;
      return idx;
    }), {});
    console.log(elemsIdx);
    types = {};
    searchParam.reduce((function(acc, x) {
      var elem, path, rt, t, tp, _i, _len, _name, _ref;
      if (x.type !== 'reference') {
        return acc;
      }
      path = x.xpath.replace(/f:/g, '').replace(/\//g, '.');
      elem = elemsIdx[path];
      if (!elem) {
        return acc;
      }
      _ref = elem.definition.type;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        t = _ref[_i];
        acc.push({
          sp: x,
          tp: t
        });
        if (t.profile) {
          tp = t.profile.split("/");
          rt = tp[tp.length - 1];
          if (rt !== 'Any') {
            (types[_name = x.name] || (types[_name] = [])).push(rt);
          }
        }
      }
      return acc;
    }), []);
    return types;
  };

  Query = (function() {
    function Query(profile) {
      this.removeParamValue = __bind(this.removeParamValue, this);
      this.addParamValue = __bind(this.addParamValue, this);
      this.cloneSearchParam = __bind(this.cloneSearchParam, this);
      this.removeSearchParam = __bind(this.removeSearchParam, this);
      this.addSearchParam = __bind(this.addSearchParam, this);
      this.toQueryString = __bind(this.toQueryString, this);
      this.removeInclude = __bind(this.removeInclude, this);
      this.addInclude = __bind(this.addInclude, this);
      this.removeSortParam = __bind(this.removeSortParam, this);
      this.addSortParam = __bind(this.addSortParam, this);
      var t, _i, _len;
      this.searchParam = profile.structure[0].searchParam;
      for (_i = 0, _len = tags.length; _i < _len; _i++) {
        t = tags[_i];
        this.searchParam.unshift(t);
      }
      this.searchChains = collectChains(profile);
      this.chainType = collectChainType(profile);
      this.searchIncludes = profile.structure[0].differential.element.filter(function(x) {
        return (x.definition.type && x.definition.type[0] && x.definition.type[0].code) === 'ResourceReference';
      });
      this.profile = profile;
    }

    Query.prototype.count = 100;

    Query.prototype.offset = 0;

    Query.prototype.sort = [];

    Query.prototype.includes = [];

    Query.prototype.params = [];

    Query.prototype.addSortParam = function(param) {
      return this.sort.push({
        name: param.name,
        direction: 'asc'
      });
    };

    Query.prototype.removeSortParam = function(param) {
      return rm(param, this.sort);
    };

    Query.prototype.addInclude = function(ref) {
      if (!(this.includes.indexOf(ref) > -1)) {
        return this.includes.push(ref);
      }
    };

    Query.prototype.removeInclude = function(ref) {
      return rm(ref, this.includes);
    };

    Query.prototype.toQueryString = function() {
      return this.params.map(_mkSearchParam).filter(identity).concat(this.sort.map(function(i) {
        return "_sort:" + (i.direction || 'asc') + "=" + i.name;
      })).concat(this.includes.map(function(i) {
        return "_include=" + i.path;
      })).join('&');
    };

    Query.prototype.addSearchParam = function(param) {
      this.params.push({
        name: param.name,
        type: param.type,
        modifier: '',
        operations: operations[param.type] || ['='],
        modifiers: modifiers[param.type] || [],
        operation: '=',
        values: [{}]
      });
      return this.params = this.params.sort(function(a, b) {
        return a.name.localeCompare(b.name);
      });
    };

    Query.prototype.removeSearchParam = function(param) {
      return rm(param, this.params);
    };

    Query.prototype.cloneSearchParam = function(param) {
      return this.addSearchParam({
        name: param.name,
        type: param.type
      });
    };

    Query.prototype.addParamValue = function(param, _arg) {
      _arg;
      return param.values.push({});
    };

    Query.prototype.removeParamValue = function(param, value) {
      return rm(value, param.values);
    };

    return Query;

  })();

  _mkSearchParam = function(p) {
    switch (p.type) {
      case 'string':
        return _stringToQuery(p);
      case 'token':
        return _tokenToQuery(p);
      case 'date':
        return _dateToQuery(p);
      case 'number':
        return _numberToQuery(p);
      case 'reference':
        return _referenceToQuery(p);
      default:
        return null;
    }
  };

  _stringToQuery = function(p) {
    var values;
    values = p.values.map(function(i) {
      return i.value;
    }).map($.trim).filter(identity);
    if (values.length === 0) {
      return null;
    }
    return "" + p.name + p.modifier + "=" + (values.join(','));
  };

  _referenceToQuery = function(p) {
    var values;
    values = p.values.map(function(i) {
      return i.value;
    }).map($.trim).filter(identity);
    if (values.length === 0) {
      return null;
    }
    return "" + p.name + p.modifier + "=" + (values.join(','));
  };

  _tokenToQuery = function(p) {
    var values;
    values = p.values.filter(function(i) {
      return $.trim(i.code);
    }).map(function(i) {
      return [i.system, i.code].filter(identity).join('|');
    });
    if (values.length === 0) {
      return null;
    }
    return "" + p.name + p.modifier + "=" + (values.join(','));
  };

  _dateToQuery = function(p) {
    var values;
    values = p.values.map(function(i) {
      return i.value;
    }).map($.trim).filter(identity);
    if (values.length === 0) {
      return null;
    }
    return "" + p.name + "=" + p.operation + (values.join(','));
  };

  _numberToQuery = function(p) {
    var values;
    values = p.values.map(function(i) {
      return i.value;
    }).map($.trim).filter(identity);
    if (values.length === 0) {
      return null;
    }
    return "" + p.name + "=" + p.operation + (values.join(','));
  };

  angular.module('ng-fhir').factory('$fhirParams', function() {
    return function(profile) {
      return new Query(profile);
    };
  });

  keyComparator = function(key) {
    return function(a, b) {
      switch (false) {
        case !(a[key] < b[key]):
          return -1;
        case !(a[key] > b[key]):
          return 1;
        default:
          return 0;
      }
    };
  };

  angular.module('ng-fhir').provider('$fhirSearch', function() {
    var cache;
    cache = {
      type: [],
      param: {},
      chain: {},
      search: {}
    };
    return {
      $get: function($fhir, $fhirParams) {
        var fillCache, filterParams, provider, typeChainParams, typeChainTypes, typeFilterChainParams, typeFilterParams, typeFilterSortedParams, typeReferenceTypes, typeSearchParams;
        $fhir.metadata(function(data) {
          return cache.type = (data.rest[0].resource.sort(keyComparator('type')) || []).map(function(i) {
            return i.type;
          });
        });
        fillCache = function(type) {
          return $fhir.profile(type, function(data) {
            var profile;
            profile = $fhirParams(data);
            cache.param[type] = profile.searchParam;
            return cache.chain[type] = profile.chainType;
          });
        };
        typeSearchParams = function(type) {
          var c;
          c = cache.param[type];
          if (c) {
            return c;
          } else {
            cache.param[type] = [];
            fillCache(type);
            console.log('profile ' + type);
            return [];
          }
        };
        typeChainTypes = function(type) {
          var c;
          c = cache.chain[type];
          if (c) {
            return c;
          } else {
            cache.chain[type] = {};
            fillCache(type);
            console.log('chain ' + type);
            return {};
          }
        };
        filterParams = function(params, filter) {
          var regexp;
          regexp = RegExp(filter.replace(/(.)/g, "$1.*"), "i");
          return params.filter(function(p) {
            return regexp.test(p.name);
          });
        };
        typeChainParams = function(type) {
          return (typeSearchParams(type) || []).filter(function(p) {
            return p.type === 'reference';
          });
        };
        typeReferenceTypes = function(type, ref) {
          return typeChainTypes(type)[ref] || cache.type;
        };
        typeFilterChainParams = function(type, filter) {
          var chains, params;
          chains = typeChainParams(type).map(function(p) {
            return typeReferenceTypes(type, p.name).map(function(t) {
              return {
                name: p.name + ':' + t,
                type: t
              };
            });
          });
          params = chains.concat([[], []]).reduce(function(x, y) {
            return x.concat(y);
          });
          return filterParams(params, filter);
        };
        typeFilterParams = function(type, parts) {
          var next;
          if (parts.length < 2) {
            return filterParams(typeSearchParams(type) || [], parts[0] || '');
          } else {
            next = typeFilterChainParams(type, parts[0]).map(function(c) {
              return typeFilterParams(c.type, parts.slice(1)).map(function(p) {
                return {
                  name: c.name + '.' + p.name,
                  type: p.type,
                  documentation: p.documentation,
                  xpath: p.xpath
                };
              });
            });
            return next.concat([[], []]).reduce(function(x, y) {
              return x.concat(y);
            });
          }
        };
        typeFilterSortedParams = function(type, filter) {
          return typeFilterParams(type, filter.split(".")).sort(function(a, b) {
            return a.name.localeCompare(b.name);
          });
        };
        provider = {
          cache: cache,
          typeFilterSearchParams: function(type, filter) {
            var one, two;
            one = typeFilterSortedParams(type, filter);
            two = typeFilterSortedParams(type, filter + ".");
            return one.concat(two).map(function(p) {
              var _base, _name;
              return (_base = cache.search)[_name = p.name] || (_base[_name] = p);
            }).slice(0, 30);
          }
        };
        return provider;
      }
    };
  });

}).call(this);
