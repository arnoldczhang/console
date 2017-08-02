;(function () {

  function extend (target) {
    var args = arguments,
      slice = [].slice,
      source = slice.call(args, 1)
      ;

    source.forEach(function (s) {
      for (var key in s) {
        if (s.hasOwnProperty(key)) {
          target[key] = s[key];
        }
      }
    });
    return target; 
  };

  function createAction (type) {
    return function (data) {
      return {
        type: type,
        data: data,
      }
    };
  };

  function createReducer (initState, cb) {
    cb = cb.bind(this, initState);
    return function (payload) {
      return cb(this.middlewares(payload));
    };
  };

  function combineReducer (reducerObj) {
    return reducerObj;
  };

  function applyMiddleware () {
    var argsCb = arguments,
      reduce = [].reduce
      ;

    return function (action) {
      return reduce.call(argsCb, function (accum, current) {
        return current(accum);
      }, action);
    };
  };

  function createStore (reducers, middlewares) {
    var result = {
      update: function update (payload, updateFlag) {
        var reducers = this.reducers,
          reducer
          ;
        for (var key in reducers) {
          reducer = reducers[key];
          this[key] = reducer.call(this, payload);
        }

        if (updateFlag) {
          this.components.forEach(function (component) {
            return component.update();
          });
        }
      },
      reducers: reducers,
      middlewares: middlewares,
      components: [],
    };
    return result.update(), result;
  };

  function createSelector () {
    var args = arguments,
      slice = [].slice,
      getters = slice.call(args, 0, -1),
      resultCb = args[args.length - 1],
      len = getters.length,
      resultArr = Array(len);
      ;
    return function (store) {
      for (var i = 0; i < len; i++) {
        resultArr[i] = getters[i](store) || {};
      }
      return resultCb.apply(this, resultArr);
    };
  };

  function Component (selector, props, store) {
    function Component () {};
    var proto = Component.prototype;
    proto.props = {};
    proto.update = function () {
      extend(this.props, this.selector(store));
      return this.render();
    };

    proto.render = function () {};
    var inst = Object.create(proto);
    inst.store = store;
    store.components.push(inst);
    inst.selector = selector;
    inst.props.dispatch = function dispatch (payload) {
      return inst.store.update(payload, true);
    };
    extend(inst, props);
    return inst.update(),
      inst;
  };

  function isPromise (promise) {
    return promise && promise.then;
  };

  function promise (action) {
    if (action && isPromise(action.data)) {
      return action.data.then(function (res) {
        return {
          type: action.type,
          data: res,
        };
      });
    }
    return action;
  };

  /**
   * example
   */
  
  //action-type
  var TYPE = {
    ADDADDR: 'addAddress',
    ADDADDRSUC: 'addAddressSuc',
    ADDADDRFAIL: 'addAddressFail',
  };

  //actions
  var addAddress = createAction(TYPE.ADDADDR);
  var addAddressSuc = createAction(TYPE.ADDADDRSUC);
  var addAddressFail = createAction(TYPE.ADDADDRFAIL);

  var actionAddAddress = function (dispatch, address) {
    dispatch(addAddress());

    if (address != void 0) {
      dispatch(addAddressSuc(address));
    }

    else {
      dispatch(addAddressFail({
        msg: 'fail to update address',
      }));
    }
  };

  //reducer
  var addressReducer = createReducer({
    addressName: 'anhua',
  }, function (initState, payload) {
    payload = payload || {};
    var type = payload.type,
      data = payload.data || {}
      ;

    switch (type) {
      case TYPE.ADDADDR:
        return extend({}, initState, {
          addressName: '更新地址中...',
        });
      case TYPE.ADDADDRSUC:
        return extend({}, initState, {
          addressName: data.addressName,
        });
        break;
      case TYPE.ADDADDRFAIL:
        break;
      default:
        return initState;
    };
  });

  var mobileReducer = createReducer({
    mobileNo: 123,
  }, function (initState, payload) {
    payload = payload || {};
    var type = payload.type,
      data = payload.data
      ;

    switch (type) {
      case 1:
        break;
      default:
        return initState;
    };
  });

  var menuReducer = createReducer({
    dish: [],
  }, function (initState, payload) {
    payload = payload || {};
    var type = payload.type,
      data = payload.data,
      addressName
      ;

    switch (type) {
      case TYPE.ADDADDRSUC:
        addressName = data.addressName;
        if (addressName === 'yiyuan') {
          return extend({}, initState, {
            dish: [
              {
                name: 'a',
              },
              {
                name: 'b',
              }
            ],
          });
        }

        else if (addressName === 'meituan') {
          return extend({}, initState, {
            dish: [
              {
                name: 'c',
              },
              {
                name: 'd',
              }
            ],
          });
        }

        else {
          return initState;
        }
        break;
      default:
        return initState;
    };
  });

  var reducers = combineReducer({
    address: addressReducer,
    mobile: mobileReducer,
    menu: menuReducer,
  });

  //store
  var store = createStore(reducers, applyMiddleware(promise));

  //selector
  var addressSelector = function (store) {
    return store.address;
  };

  var mobileSelector = function (store) {
    return store.mobile;
  };

  var menuSelector = function (store) {
    return store.menu;
  };

  var headerReselector = createSelector(addressSelector, mobileSelector, function (address, mobile) {
    return {
      addressName: address.addressName,
      mobileNo: mobile.mobileNo,
    };
  });

  var bodyReselector = createSelector(menuSelector, function (menu) {
    return {
      dish: menu.dish,
    };
  });

  //component
  headerComponent = Component(headerReselector, {
    addAddress: function addAddress (address) {
      actionAddAddress(this.props.dispatch, address);
    },

    render: function render () {
      console.log(this.props);
    },
  }, store);

  bodyComponent = Component(bodyReselector, {
    addAddress: function addAddress (address) {
      actionAddAddress(this.props.dispatch, address);
    },
    render: function render () {
      console.log(this.props.dish);
    },
  }, store);

  headerComponent.addAddress({
    addressName: 'yiyuan'
  });
} ())
