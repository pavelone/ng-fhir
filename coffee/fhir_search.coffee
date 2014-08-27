type = (obj) ->
    if obj == undefined or obj == null
      return String obj
    classToType =
      '[object Boolean]': 'boolean',
      '[object Number]': 'number',
      '[object String]': 'string',
      '[object Function]': 'function',
      '[object Array]': 'array',
      '[object Date]': 'date',
      '[object RegExp]': 'regexp',
      '[object Object]': 'object'
    return classToType[Object.prototype.toString.call(obj)]

OPERATORS =
  $gt: '>'
  $lt: '<'

MODIFIERS=
  $exact: ':exact'
  $missing: ':missing'
  $null: ':missing'
  $text: ':text'

isOperator = (v)->
  v.indexOf('$') == 0

evalObjectValue = (o)->
  ("#{OPERATORS[k]}#{v}" for k,v of o).join("???")

evalValue = (v)->
  switch type(v)
    when 'object' then evalObjectValue(v)
    when 'string' then v
    else throw 'could not evalValue'

tap = (o, cb)-> cb(o); o

assertArray = (a)->
  throw 'not array' unless type(a) == 'array'
  a

expandParam = (k,v)->
  reduceFn = (acc, [kk,vv])->
    acc.concat if kk == '$and'
      assertArray(vv)
        .reduce(((a,vvv)-> a.concat(linearizeOne(k,vvv))), [])
    else if isOperator(kk)
      o = {param: k}
      if kk == '$or'
        o.value = vv
      else
        o.operator = OPERATORS[kk] if OPERATORS[kk]
        o.modifier = MODIFIERS[kk] if MODIFIERS[kk]
        if type(vv) == 'object' && vv.$or
          o.value = vv.$or
        else
          o.value = [vv]
      [o]
    else
      linearizeOne("#{k}.#{kk}", vv)

  ([x,y] for x,y of v).reduce(reduceFn, [])


linearizeOne = (k,v)->
  switch type(v)
    when 'object'
      expandParam(k,v)
    when 'string'
      [{param: k, value: [v]}]
    when 'number'
      [{param: k, value: [v]}]
    when 'array'
      [{param: k, value: [v.join("|")]}]
    else throw "could not linearizeParams #{type(v)}"

linearizeParams = (query)->
  reduceFn = (acc, [k,v])-> acc.concat(linearizeOne(k,v))
  ([k,v] for k,v of query).reduce(reduceFn, [])

buildPair = (k,v)->
  "#{k}=#{evalValue(v)}"

identity = (x)-> x

buildSearchParams = (query)->
  ps = for p in linearizeParams(query)
   [p.param,p.modifier,'=', p.operator, p.value].filter(identity).join('')
  ps.join "&"

angular
  .module('ng-fhir')
  .factory '$fhirSearchBuilder', ()-> buildSearchParams
  .factory '$fhirSearchInternal', ()->
    linearizeParams: linearizeParams
